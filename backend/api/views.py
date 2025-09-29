# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
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
