from django.urls import path
from .views import (
    health_check, 
    BalanceReactionView, 
    QAAView, 
    CorrectionView,
    RegisterView, 
    LoginView, 
    LogoutView, 
    MeView,
    ProfileView
)

urlpatterns = [
    path('health/', health_check, name="health_check"),
    path('reactions/balance/', BalanceReactionView.as_view(), name="balance_reaction"),
    path('qa/', QAAView.as_view(), name="qa"),
    path('correction/', CorrectionView.as_view(), name="correction"),
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
]
