import traceback
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from utils.currencies import get_currency_rates
from .serializers import *


class CurrenciesViewSet(ModelViewSet):
    queryset = CurrenciesModel.objects.all()
    serializer_class = CurrencySerializer

    def create(self, request: Request, *args, **kwargs) -> Response:
        try:
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list), *args, **kwargs)
            if serializer.is_valid(raise_exception=False):
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)

                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            traceback.print_exc()

            return Response("Erro interno ao criar moeda de câmbio!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CurrencyRatesViewSet(ModelViewSet):
    queryset = CurrencyRatesModel.objects.all()
    serializer_class = CurrencyRateSerializer

    def create(self, request: Request, *args, **kwargs) -> Response:
        try:
            base_currency = request.data.get("currency")
            to_currency = request.data.get("rates")

            if not base_currency or not to_currency:
                return Response("Os campos `currency` e `rates` são obrigatórios!", status=status.HTTP_400_BAD_REQUEST)

            rates = get_currency_rates(base_currency, to_currency)

            if type(rates) == str:
                return Response(rates, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            data = [
                {"base_currency": base_currency, "to_currency": to_currency, "rate": rates[0]},
                {"base_currency": to_currency, "to_currency": base_currency, "rate": rates[-1]},
            ]

            serializer = self.get_serializer(data=data, many=True, *args, **kwargs)
            if serializer.is_valid(raise_exception=False):
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)

                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            traceback.print_exc()

            return Response("Erro interno ao recuperar taxa de câmbio!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
