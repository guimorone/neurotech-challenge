from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(r"currencies", CurrenciesViewSet, basename="Currencies")
router.register(r"currency-rates", CurrencyRatesViewSet, basename="CurrencyRates")

urlpatterns = [
    path("currency", get_current_rates),
    path("", include(router.urls)),
]
