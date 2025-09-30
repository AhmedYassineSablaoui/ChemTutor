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
from api.services.chemberta_service import ChemBERTaService
from api.services.retrieval_service import RetrievalService

@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})

class QAAView(APIView):
    def __init__(self):
        super().__init__()
        # Initialize services once when the view is created
        self.retriever = RetrievalService()
        self.generator = ChemBERTaService()
    
    def post(self, request):
        question = request.data.get('question')
        if not question:
            return Response({'error': 'Missing question'}, status=400)
        
        try:
            context_list = self.retriever.retrieve(question)
            context = "\n".join(context_list)
            answer = self.generator.generate_answer(f"Context: {context}\nQuestion: {question}")
            return Response({'answer': answer, 'sources': context_list})
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
