import traceback
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from utils.misc import format_datestring
from utils.currencies import get_currency_rates
from .serializers import *


class CurrencyRatesViewSet(ModelViewSet):
    queryset = CurrencyRatesModel.objects.all()
    serializer_class = CurrencyRateSerializer

    def list(self, _: Request) -> Response:
        try:
            queryset = self.filter_queryset(self.get_queryset())

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            data = [{**data, "created_at": format_datestring(data["created_at"])} for data in serializer.data]

            return Response(data, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()

            return Response("Erro interno ao listar taxas de câmbio!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request: Request, *args, **kwargs) -> Response:
        try:
            base_currency = request.data.get("base_currency")
            to_currency = request.data.get("to_currency")

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
                data = [{**data, "created_at": format_datestring(data["created_at"])} for data in serializer.data]

                return Response(data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            traceback.print_exc()

            return Response("Erro interno ao recuperar taxa de câmbio!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=["DELETE"], detail=False, url_path="delete-all", url_name="delete-all")
    def delete_all(self, _: Request) -> Response:
        try:
            qtd, _ = self.queryset.delete()

            return Response(f"{qtd} elemento(s) destruído(s) com sucesso.", status=status.HTTP_200_OK)
        except:
            traceback.print_exc()

            return Response("Erro interno ao deletar resultados!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
