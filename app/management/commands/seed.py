from django.core.management.base import BaseCommand
from app.models import Currency  # Reemplaza con tu modelo real

class Command(BaseCommand):
    help = 'Siembra datos de ejemplo en la base de datos'

    def handle(self, *args, **kwargs):
        Currency.objects.create(name='Bitcoin', symbol='BTC')
        Currency.objects.create(name='Ethereum', symbol='ETH')
        Currency.objects.create(name='Sol Peruano', symbol='PEN')
        Currency.objects.create(name='Tether', symbol='USDT')
        self.stdout.write(self.style.SUCCESS('¡Criptos sembradas correctamente!'))
