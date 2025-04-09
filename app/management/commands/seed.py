from django.core.management.base import BaseCommand
from app.models import Currency  # Reemplaza con tu modelo real

class Command(BaseCommand):
    help = 'Siembra datos de ejemplo en la base de datos'

    def handle(self, *args, **kwargs):
        Currency.objects.create(name='Bitcoin', symbol='BTC')
        Currency.objects.create(name='Ethereum', symbol='ETH')
        Currency.objects.create(name='Sol Peruano', symbol='PEN')
        Currency.objects.create(name='Tether', symbol='USDT')
        Currency.objects.create(name='Binance Coin', symbol='BNB')
        Currency.objects.create(name='Polkadot', symbol='DOT')
        Currency.objects.create(name='XRP', symbol='XRP')
        Currency.objects.create(name='Litecoin', symbol='LTC')
        Currency.objects.create(name='Chainlink', symbol='LINK')
        self.stdout.write(self.style.SUCCESS('¡Criptos sembradas correctamente!'))
