from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from forex_python.converter import CurrencyRates

c = CurrencyRates()


class CurrencyView(APIView):
    def get(self, _request: Request) -> Response:
        return Response(
            {"USD": [("BRL", c.get_rate("USD", "BRL"))], "BRL": [("USD", c.get_rate("BRL", "USD"))]},
            status=status.HTTP_200_OK,
        )
