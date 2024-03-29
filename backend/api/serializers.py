from rest_framework.serializers import ModelSerializer
from .models import *


class CurrencyRateSerializer(ModelSerializer):
    class Meta:
        model = CurrencyRatesModel
        fields = "__all__"
