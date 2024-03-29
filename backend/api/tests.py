from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db.utils import DataError
from rest_framework import status
from constants.routes import CURRENCY_RATES_ROUTE
from .models import CurrencyRatesModel

base_route = f"/api/{CURRENCY_RATES_ROUTE}/"


class CurrencyRatesTestCase(TestCase):
    def test_create_currency_rates_directly(self):
        instance = CurrencyRatesModel.objects.create(base_currency="BRL", to_currency="USD", rate=1.0)
        currency_rate = CurrencyRatesModel.objects.get(pk=instance.pk)
        self.assertIsNotNone(currency_rate.created_at)

    def test_failed_creation_currency_rates(self):
        with self.assertRaises(ValidationError):
            _ = CurrencyRatesModel.objects.create(base_currency="BRL", to_currency="USD", rate=-1.0)

        with self.assertRaises(DataError):
            _ = CurrencyRatesModel.objects.create(base_currency="INVALID", to_currency="USD", rate=1.0)

    def test_create_currency_rates_with_invalid_base_currency(self):
        response = self.client.post(base_route, {"base_currency": "INVALID", "to_currency": "USD"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_currency_rates(self):
        response = self.client.post(base_route, {"base_currency": "BRL", "to_currency": "USD"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data_is_list = type(response.data) == list

        self.assertTrue(data_is_list)

        if data_is_list:
            for r in response.data:
                currency_rate = CurrencyRatesModel.objects.get(pk=r.get("id"))
                self.assertTrue(currency_rate.rate > 0)

    def test_get_currency_rates(self):
        response = self.client.get(base_route)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_all_currency_rates(self):
        response = self.client.delete(f"{base_route}delete-all/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        queryset = CurrencyRatesModel.objects.all()
        self.assertEqual(queryset.count(), 0)
