from django.db import models


class CurrencyRatesModel(models.Model):
    # Campo Id como chave primária (django.db.models.BigAutoField) -> Inserção automática do django
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
        ordering = ["base_currency", "to_currency", "created_at", "rate"]
