import traceback
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet
from forex_python.converter import CurrencyRates, RatesNotAvailableError
from .serializers import *


@api_view(["GET"])
def get_current_rates(_request: Request) -> Response:
    try:
        c = CurrencyRates()

        return Response(
            {"USD": [("BRL", c.get_rate("USD", "BRL"))], "BRL": [("USD", c.get_rate("BRL", "USD"))]},
            status=status.HTTP_200_OK,
        )
    except RatesNotAvailableError as err:
        return Response(str(err), status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except:
        traceback.print_exc()

        return Response("Erro interno, tente novamente mais tarde!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CurrenciesViewSet(ModelViewSet):
    queryset = CurrenciesModel.objects.all()
    serializer_class = CurrencySerializer

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list), *args, **kwargs)
        if serializer.is_valid(raise_exception=False):
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrencyRatesViewSet(ModelViewSet):
    queryset = CurrencyRatesModel.objects.all()
    serializer_class = CurrencyRateSerializer

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list), *args, **kwargs)
        if serializer.is_valid(raise_exception=False):
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
