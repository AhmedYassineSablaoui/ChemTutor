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
        
        try:
            result = self.orchestrator.run_workflow("qa", question)
            return Response({'answer': result.get('answer'), 'sources': result.get('sources', [])})
        except Exception as e:
            return Response({'error': f'Processing failed: {str(e)}'}, status=500)
class BalanceReactionView(APIView):
    def post(self, request):
        input_reaction = request.data.get('input')
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

            return Response(result)
        except ValueError as e:
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
            try:
                result = self.orchestrator.run_workflow("correction", statement)
                corrected_statement = result.get('corrected')
                
                if not corrected_statement:
                    logger.warning(f"Empty correction result for statement: {statement[:100]}")
                    return Response({
                        'success': False,
                        'error': 'Correction failed',
                        'error_code': 'EMPTY_RESULT',
                        'details': 'The model returned an empty result'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                # Determine if the statement was changed
                changed = statement.lower().strip() != corrected_statement.lower().strip()
                
                return Response({
                    'success': True,
                    'original': statement,
                    'corrected': corrected_statement,
                    'changed': changed
                }, status=status.HTTP_200_OK)
                
            except RuntimeError as e:
                logger.error(f"Model inference error: {str(e)}")
                logger.error(traceback.format_exc())
                return Response({
                    'success': False,
                    'error': 'Model inference failed',
                    'error_code': 'INFERENCE_ERROR',
                    'details': 'An error occurred during model prediction',
                    'debug_info': str(e) if request.user.is_staff else None
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            except Exception as e:
                logger.error(f"Unexpected error during correction: {str(e)}")
                logger.error(traceback.format_exc())
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
        if not user:
            return Response({'error': 'invalid credentials'}, status=401)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': {'id': user.id, 'username': user.username, 'email': user.email}})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Delete the token to logout
        Token.objects.filter(user=request.user).delete()
        return Response({'success': True})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'id': user.id, 'username': user.username, 'email': user.email})
