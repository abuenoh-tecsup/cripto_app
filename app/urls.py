# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrencyViewSet, WalletViewSet, TransactionViewSet

# Crear un enrutador para los viewsets
router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet)  # Ruta para las monedas
router.register(r'wallets', WalletViewSet)  # Ruta para las billeteras
router.register(r'transactions', TransactionViewSet)  # Ruta para las transacciones

urlpatterns = [
    path('api/', include(router.urls)),  # Incluir las rutas generadas automáticamente
]
