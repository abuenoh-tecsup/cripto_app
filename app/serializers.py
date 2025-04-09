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
    #currency = CurrencySerializer()

    class Meta:
        model = Wallet
        fields = ['id', 'currency', 'balance']  # Eliminar 'user' si no lo vas a usar

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer para las transacciones realizadas"""
    #currency_from = CurrencySerializer()  # Incluir la información de la moneda asociada a la transacción
    #currency_to = CurrencySerializer()  # Incluir la información de la moneda asociada a la transacción
    #wallet = WalletSerializer()  # Incluir la información de la billetera asociada a la transacción
    currency_from = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all())  # Cambiado de CurrencySerializer a PrimaryKeyRelatedField
    currency_to = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all())    # Cambiado de CurrencySerializer a PrimaryKeyRelatedField
    wallet = serializers.PrimaryKeyRelatedField(queryset=Wallet.objects.all())  # Cambiado de WalletSerializer a PrimaryKeyRelatedField


    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'amount', 'total_value', 'currency_from', 'currency_to', 'exchange_rate', 'wallet', 'date']
