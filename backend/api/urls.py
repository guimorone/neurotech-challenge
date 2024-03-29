from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrencyRatesViewSet


router = DefaultRouter()

router.register(r"currency-rates", CurrencyRatesViewSet, basename="CurrencyRates")

urlpatterns = [path("", include(router.urls))]
