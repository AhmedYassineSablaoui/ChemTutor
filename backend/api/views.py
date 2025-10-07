# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from api.services.reaction_balancer import balance_reaction
from api.services.compound_lookup import lookup_compound
from api.services.orchestrator import Orchestrator
import logging
import traceback
import time
from rest_framework import serializers
from rest_framework.throttling import UserRateThrottle
from .models import (
    UserProfile, LoginHistory, ReactionFormatter, 
    QAHistory, CorrectionHistory
)

logger = logging.getLogger(__name__)

@api_view(["GET"]) 
def health_check(request):
    return Response({"status": "ok"})

class QAAView(APIView):
    def __init__(self):
        super().__init__()
        # Initialize orchestrator once
        self.orchestrator = Orchestrator()
    
    def post(self, request):
        question = request.data.get('question')
        if not question:
            return Response({'error': 'Missing question'}, status=400)
        
        start_time = time.time()
        user = request.user if request.user.is_authenticated else None
        
        try:
            result = self.orchestrator.run_workflow("qa", question)
            response_time = time.time() - start_time
            
            # Save to QAHistory table
            QAHistory.objects.create(
                user=user,
                question=question,
                answer=result.get('answer'),
                sources=result.get('sources', []),
                is_successful=True,
                response_time=response_time
            )
            
            return Response({'answer': result.get('answer'), 'sources': result.get('sources', [])})
        except Exception as e:
            response_time = time.time() - start_time
            
            # Save failed attempt to QAHistory table
            QAHistory.objects.create(
                user=user,
                question=question,
                is_successful=False,
                error_message=str(e),
                response_time=response_time
            )
            
            return Response({'error': f'Processing failed: {str(e)}'}, status=500)
class BalanceReactionView(APIView):
    def post(self, request):
        input_reaction = request.data.get('input')
        user = request.user if request.user.is_authenticated else None
        
        if not input_reaction:
            return Response(
                {'error': 'Missing input'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            result = balance_reaction(input_reaction)

            # 🔹 Add metadata enrichment
            enriched_metadata = {}
            for side in ["reactants", "products"]:
                enriched_metadata[side] = []
                for token in input_reaction.replace("->", "+").split("+"):
                    token = token.strip()
                    if token:
                        meta = lookup_compound(token)
                        if meta:
                            enriched_metadata[side].append(meta)

            result["metadata"] = enriched_metadata
            
            # Save to ReactionFormatter table
            ReactionFormatter.objects.create(
                user=user,
                input_reaction=input_reaction,
                balanced_reaction=result.get('balanced'),
                reactants=result.get('reactants'),
                products=result.get('products'),
                metadata=enriched_metadata,
                is_successful=True
            )

            return Response(result)
        except ValueError as e:
            # Save failed attempt to ReactionFormatter table
            ReactionFormatter.objects.create(
                user=user,
                input_reaction=input_reaction,
                is_successful=False,
                error_message=str(e)
            )
            
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class CorrectionView(APIView):
    """
    API endpoint for correcting chemistry statements using the correction model.
    
    POST /api/correction/
    Request body: {"statement": "Your chemistry statement here"}
    Response: {"original": "...", "corrected": "...", "success": true}
    """
    
    def __init__(self):
        super().__init__()
        # Initialize orchestrator once
        self.orchestrator = Orchestrator()
    
    def post(self, request):
        """
        Correct a chemistry statement.
        
        Request body:
        {
            "statement": "The chemistry statement to correct"
        }
        
        Response:
        {
            "success": true,
            "original": "input statement",
            "corrected": "corrected statement",
            "changed": true/false
        }
        """
        try:
            # Validate input
            statement = request.data.get('statement')
            
            if not statement:
                return Response({
                    'success': False,
                    'error': 'Missing required field: statement',
                    'error_code': 'MISSING_STATEMENT',
                    'details': 'The "statement" field is required in the request body'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not isinstance(statement, str):
                return Response({
                    'success': False,
                    'error': 'Invalid data type for statement',
                    'error_code': 'INVALID_TYPE',
                    'details': f'Expected string, got {type(statement).__name__}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Clean and validate statement
            statement = statement.strip()
            
            if len(statement) == 0:
                return Response({
                    'success': False,
                    'error': 'Statement cannot be empty',
                    'error_code': 'EMPTY_STATEMENT',
                    'details': 'Please provide a non-empty chemistry statement'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if len(statement) > 1000:
                return Response({
                    'success': False,
                    'error': 'Statement too long',
                    'error_code': 'STATEMENT_TOO_LONG',
                    'details': f'Statement length ({len(statement)}) exceeds maximum of 1000 characters'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Perform correction
            start_time = time.time()
            user = request.user if request.user.is_authenticated else None
            
            try:
                result = self.orchestrator.run_workflow("correction", statement)
                corrected_statement = result.get('corrected')
                response_time = time.time() - start_time
                
                if not corrected_statement:
                    logger.warning(f"Empty correction result for statement: {statement[:100]}")
                    
                    # Save failed attempt to CorrectionHistory table
                    CorrectionHistory.objects.create(
                        user=user,
                        original_statement=statement,
                        is_successful=False,
                        error_message='The model returned an empty result',
                        response_time=response_time
                    )
                    
                    return Response({
                        'success': False,
                        'error': 'Correction failed',
                        'error_code': 'EMPTY_RESULT',
                        'details': 'The model returned an empty result'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                # Determine if the statement was changed
                changed = statement.lower().strip() != corrected_statement.lower().strip()
                
                # Save to CorrectionHistory table
                CorrectionHistory.objects.create(
                    user=user,
                    original_statement=statement,
                    corrected_statement=corrected_statement,
                    was_changed=changed,
                    is_successful=True,
                    response_time=response_time
                )
                
                return Response({
                    'success': True,
                    'original': statement,
                    'corrected': corrected_statement,
                    'changed': changed
                }, status=status.HTTP_200_OK)
                
            except RuntimeError as e:
                response_time = time.time() - start_time
                logger.error(f"Model inference error: {str(e)}")
                logger.error(traceback.format_exc())
                
                # Save failed attempt to CorrectionHistory table
                CorrectionHistory.objects.create(
                    user=user,
                    original_statement=statement,
                    is_successful=False,
                    error_message=f'Model inference failed: {str(e)}',
                    response_time=response_time
                )
                
                return Response({
                    'success': False,
                    'error': 'Model inference failed',
                    'error_code': 'INFERENCE_ERROR',
                    'details': 'An error occurred during model prediction',
                    'debug_info': str(e) if request.user.is_staff else None
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            except Exception as e:
                response_time = time.time() - start_time
                logger.error(f"Unexpected error during correction: {str(e)}")
                logger.error(traceback.format_exc())
                
                # Save failed attempt to CorrectionHistory table
                CorrectionHistory.objects.create(
                    user=user,
                    original_statement=statement,
                    is_successful=False,
                    error_message=f'Processing error: {str(e)}',
                    response_time=response_time
                )
                
                return Response({
                    'success': False,
                    'error': 'Correction processing failed',
                    'error_code': 'PROCESSING_ERROR',
                    'details': 'An unexpected error occurred while processing your request',
                    'debug_info': str(e) if request.user.is_staff else None
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            # Catch-all for any unexpected errors
            logger.error(f"Unhandled error in CorrectionView: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                'success': False,
                'error': 'Internal server error',
                'error_code': 'INTERNAL_ERROR',
                'details': 'An unexpected error occurred',
                'debug_info': str(e) if hasattr(request, 'user') and request.user.is_staff else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password:
            return Response({'error': 'username and password are required'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'username already taken'}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': {'id': user.id, 'username': user.username, 'email': user.email}})


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'username and password are required'}, status=400)
        
        user = authenticate(username=username, password=password)
        
        # Get client info
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        if not user:
            # Log failed login attempt (optional - you can create a FailedLoginAttempt model if needed)
            return Response({'error': 'invalid credentials'}, status=401)
        
        token, _ = Token.objects.get_or_create(user=user)
        
        # Save successful login to LoginHistory table
        LoginHistory.objects.create(
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
            session_token=token.key,
            is_successful=True
        )
        
        return Response({'token': token.key, 'user': {'id': user.id, 'username': user.username, 'email': user.email}})
    
    def get_client_ip(self, request):
        """Get the client's IP address from the request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Update logout time in LoginHistory
        try:
            from django.utils import timezone
            token = Token.objects.get(user=request.user)
            login_record = LoginHistory.objects.filter(
                user=request.user,
                session_token=token.key,
                logout_time__isnull=True
            ).first()
            
            if login_record:
                login_record.logout_time = timezone.now()
                login_record.save()
        except Exception as e:
            logger.warning(f"Could not update logout time: {str(e)}")
        
        # Delete the token to logout
        Token.objects.filter(user=request.user).delete()
        return Response({'success': True})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'id': user.id, 'username': user.username, 'email': user.email})


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'last_login']
        read_only_fields = ['id', 'username', 'date_joined', 'last_login']


class ProfileUpdateThrottle(UserRateThrottle):
    rate = '5/hour'


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ProfileUpdateThrottle]

    def get(self, request):
        """Get user profile information"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Update user profile information"""
        user = request.user
        email = request.data.get('email')
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        # Update email if provided
        if email is not None:
            user.email = email

        # Update password if both current and new passwords are provided
        if current_password and new_password:
            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=400)
            user.set_password(new_password)
            # Update token after password change
            Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)
            user.save()
            return Response({
                'message': 'Profile updated successfully',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })

        user.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })

    def delete(self, request):
        """Delete user account"""
        user = request.user
        password = request.data.get('password')

        if not password:
            return Response({'error': 'Password is required to delete account'}, status=400)

        if not user.check_password(password):
            return Response({'error': 'Incorrect password'}, status=401)

        # Delete user's token
        Token.objects.filter(user=user).delete()
        # Delete user account
        user.delete()

        return Response({'message': 'Account deleted successfully'}, status=200)