from rest_framework import viewsets
from .models import Currency, Wallet, Transaction
from .serializers import CurrencySerializer, WalletSerializer, TransactionSerializer

class CurrencyViewSet(viewsets.ModelViewSet):
    """Vista para manejar operaciones CRUD de las monedas (Currency)."""
    queryset = Currency.objects.all() 
    serializer_class = CurrencySerializer 

class WalletViewSet(viewsets.ModelViewSet):
    """Vista para manejar operaciones CRUD de las billeteras (Wallet)."""
    queryset = Wallet.objects.all() 
    serializer_class = WalletSerializer 

class TransactionViewSet(viewsets.ModelViewSet):
    """Vista para manejar operaciones CRUD de las transacciones (Transaction)."""
    queryset = Transaction.objects.all() 
    serializer_class = TransactionSerializer  
