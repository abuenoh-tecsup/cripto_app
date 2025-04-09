from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrencyViewSet, WalletViewSet, TransactionViewSet


router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet) 
router.register(r'wallets', WalletViewSet)  
router.register(r'transactions', TransactionViewSet) 

urlpatterns = [
    path('api/', include(router.urls)),  
]
