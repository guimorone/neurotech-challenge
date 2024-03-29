from typing import Dict
from rest_framework import status

DEFAULT_ERROR_MSG = "Erro interno, tente novamente mais tarde!"

VIEW_CONST_ERROR_RESPONSES: Dict[str, str] = {
    f"LIST_CURRENCY_RATES_{status.HTTP_500_INTERNAL_SERVER_ERROR}": "Erro interno ao listar taxas de câmbio salvas!",
    f"CREATE_CURRENCY_RATES_{status.HTTP_400_BAD_REQUEST}": "Os campos `currency` e `rates` são obrigatórios!",
    f"CREATE_CURRENCY_RATES_{status.HTTP_500_INTERNAL_SERVER_ERROR}": "Erro interno ao recuperar taxa de câmbio!",
    f"DELETE_ALL_CURRENCY_RATES_{status.HTTP_500_INTERNAL_SERVER_ERROR}": "Erro interno ao deletar resultados!",
}
