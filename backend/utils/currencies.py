from typing import List
from forex_python.converter import CurrencyRates, RatesNotAvailableError


def get_currency_rates(base_currency: str, to_currency: str) -> List[float] | str:
    try:
        c = CurrencyRates()

        return [c.get_rate(base_currency, to_currency), c.get_rate(to_currency, base_currency)]
    except RatesNotAvailableError as err:
        return str(err)
