from django.db import models
from decimal import Decimal

class Currency(models.Model):
    """Modelo para almacenar las monedas disponibles como USD, USDT, BTC, etc."""
    symbol = models.CharField(max_length=10) 
    name = models.CharField(max_length=50) 
    
    def __str__(self):
        return self.symbol

class Wallet(models.Model):
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)  
    balance = models.DecimalField(max_digits=30, decimal_places=16, default=Decimal('0.0'))

    def __str__(self):
        return f"Wallet - {self.currency.symbol}: {self.balance} {self.currency.symbol}"

class Transaction(models.Model):
    """Modelo opcional para almacenar las transacciones realizadas (depósitos, conversiones)."""
    
    TRANSACTION_TYPES = (
        ('DEPOSIT', 'Depósito'),
        ('WITHDRAWAL', 'Retiro'),
        ('CONVERSION', 'Conversión'),
    )

    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)  
    amount = models.DecimalField(max_digits=30, decimal_places=16)  
    total_value = models.DecimalField(max_digits=30, decimal_places=16)  
    currency_from = models.ForeignKey(Currency, related_name='currency_from', on_delete=models.CASCADE)
    currency_to = models.ForeignKey(Currency, related_name='currency_to', on_delete=models.CASCADE) 
    exchange_rate = models.DecimalField(max_digits=30, decimal_places=16)  
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)  
    date = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} {self.currency_from.symbol} to {self.currency_to.symbol} on {self.date}"
