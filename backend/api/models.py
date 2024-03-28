from django.db import models


class CurrencyRatesModel(models.Model):
    base_currency = models.CharField(max_length=3)
    to_currency = models.CharField(max_length=3)
    rate = models.FloatField()  # Considerando o valor unitário do `base_currency`
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    def __str__(self):
        return f"{self.base_currency} - {self.rate}"

    class Meta:
        verbose_name = "Taxa de Câmbio"
        verbose_name_plural = "Taxas de Câmbios"
        db_table = "currency_rates"
        ordering = ["base_currency", "to_currency", "rate", "created_at"]


class CurrenciesModel(models.Model):
    currency = models.CharField(max_length=3)
    rates = models.ManyToManyField(CurrencyRatesModel)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    def __str__(self):
        return self.currency

    class Meta:
        verbose_name = "Moeda de Câmbio"
        verbose_name_plural = "Moedas de Câmbio"
        db_table = "currencies"
        ordering = ["currency", "updated_at", "created_at"]
