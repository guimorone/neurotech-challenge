from rest_framework.routers import DefaultRouter
from constants.routes import *
from .views import CurrencyRatesViewSet


router = DefaultRouter()

router.register(CURRENCY_RATES_ROUTE, CurrencyRatesViewSet, basename="CurrencyRates")

urlpatterns = router.urls
