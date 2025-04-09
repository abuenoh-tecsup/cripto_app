from rest_framework import serializers
from .models import Currency, Wallet, Transaction

class CurrencySerializer(serializers.ModelSerializer):
    """Serializer para las monedas disponibles (USD, USDT, BTC, etc.)"""
    class Meta:
        model = Currency
        fields = ['id', 'symbol', 'name']

class WalletSerializer(serializers.ModelSerializer):
    """Serializer para las billeteras de los usuarios (saldo de USDT)"""
    currency = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all())

    class Meta:
        model = Wallet
        fields = ['id', 'currency', 'balance']

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer para las transacciones realizadas"""
    currency_from = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all())
    currency_to = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all()) 
    wallet = serializers.PrimaryKeyRelatedField(queryset=Wallet.objects.all()) 


    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'amount', 'total_value', 'currency_from', 'currency_to', 'exchange_rate', 'wallet', 'date']
