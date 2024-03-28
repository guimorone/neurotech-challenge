from rest_framework.serializers import ModelSerializer
from .models import *


class CurrencyRateSerializer(ModelSerializer):
    class Meta:
        model = CurrencyRatesModel
        fields = "__all__"


class CurrencySerializer(ModelSerializer):
    class Meta:
        model = CurrenciesModel
        fields = "__all__"
