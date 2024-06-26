from django.db import models
from django.core.exceptions import ValidationError


class CurrencyRatesModel(models.Model):
    # Campo Id como chave primária (django.db.models.BigAutoField) -> Inserção automática do django
    base_currency = models.CharField(max_length=3, verbose_name="Moeda base")
    to_currency = models.CharField(max_length=3, verbose_name="Moeda destino")
    rate = models.FloatField(verbose_name="Taxa de câmbio")  # Considerando o valor unitário do `base_currency`
    created_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Data de criação")

    def __str__(self):
        return f"{self.base_currency} - {self.rate}"

    def save(self, *args, **kwargs) -> None:
        if self.rate <= 0.0:
            raise ValidationError("A taxa de câmbio deve ser maior que zero.")

        return super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Taxa de Câmbio"
        verbose_name_plural = "Taxas de Câmbios"
        db_table = "currency_rates"
        ordering = ["base_currency", "to_currency", "created_at", "rate"]
