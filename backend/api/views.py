# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from api.services.reaction_balancer import balance_reaction
from api.services.compound_lookup import lookup_compound


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})


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
