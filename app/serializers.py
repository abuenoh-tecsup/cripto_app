from rest_framework import serializers
from .models import Currency, Wallet, Transaction

class CurrencySerializer(serializers.ModelSerializer):
    """Serializer para las monedas disponibles (USD, USDT, BTC, etc.)"""
    class Meta:
        model = Currency
        fields = ['id', 'symbol', 'name']

class WalletSerializer(serializers.ModelSerializer):
    """Serializer para las billeteras de los usuarios (saldo de USDT)"""
    currency = CurrencySerializer()  # Incluir la información de la moneda (USD, USDT)

    class Meta:
        model = Wallet
        fields = ['id', 'currency', 'balance']  # Eliminar 'user' si no lo vas a usar

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer para las transacciones realizadas"""
    currency = CurrencySerializer()  # Incluir la información de la moneda asociada a la transacción
    wallet = WalletSerializer()  # Incluir la información de la billetera asociada a la transacción

    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'amount', 'total_value', 'currency', 'wallet', 'date']
