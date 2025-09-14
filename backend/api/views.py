from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from api.services.reaction_balancer import balance_reaction


@api_view(["GET"])
def health_check(request):
    """Simple health check endpoint"""
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
            return Response(result)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
