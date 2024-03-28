from dateutil import parser


def format_datestring(dt: str) -> str:
    return parser.parse(dt).strftime("%d/%m/%Y às %H:%M:%S")
