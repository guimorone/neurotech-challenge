from dateutil import parser
from constants.messages import VIEW_CONST_ERROR_RESPONSES, DEFAULT_ERROR_MSG


def get_error_msg(prefix: str, status_code: int) -> str:
    return VIEW_CONST_ERROR_RESPONSES.get(f"{prefix}_{status_code}", DEFAULT_ERROR_MSG)


def format_datestring(dt: str) -> str:
    return parser.parse(dt).strftime("%d/%m/%Y às %H:%M:%S")
