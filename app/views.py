from rest_framework import viewsets
from .models import Currency, Wallet, Transaction
from .serializers import CurrencySerializer, WalletSerializer, TransactionSerializer

class CurrencyViewSet(viewsets.ModelViewSet):
    """Vista para manejar operaciones CRUD de las monedas (Currency)."""
    queryset = Currency.objects.all()  # Todos los registros de monedas
    serializer_class = CurrencySerializer  # Usamos el serializer de Currency

class WalletViewSet(viewsets.ModelViewSet):
    """Vista para manejar operaciones CRUD de las billeteras (Wallet)."""
    queryset = Wallet.objects.all()  # Todos los registros de billeteras
    serializer_class = WalletSerializer  # Usamos el serializer de Wallet

class TransactionViewSet(viewsets.ModelViewSet):
    """Vista para manejar operaciones CRUD de las transacciones (Transaction)."""
    queryset = Transaction.objects.all()  # Todos los registros de transacciones
    serializer_class = TransactionSerializer  # Usamos el serializer de Transaction
