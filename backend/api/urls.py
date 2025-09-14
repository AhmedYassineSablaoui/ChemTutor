from django.urls import path
from .views import health_check, BalanceReactionView

urlpatterns = [
    path('health/', health_check, name="health_check"),
    path('reactions/balance/', BalanceReactionView.as_view(), name="balance_reaction"),
]
