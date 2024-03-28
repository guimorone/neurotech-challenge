import traceback
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from forex_python.converter import CurrencyRates, RatesNotAvailableError


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
