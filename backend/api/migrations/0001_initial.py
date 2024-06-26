# Generated by Django 5.0.3 on 2024-03-29 05:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CurrencyRatesModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_currency', models.CharField(max_length=3, verbose_name='Moeda base')),
                ('to_currency', models.CharField(max_length=3, verbose_name='Moeda destino')),
                ('rate', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0)], verbose_name='Taxa de câmbio')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Data de criação')),
            ],
            options={
                'verbose_name': 'Taxa de Câmbio',
                'verbose_name_plural': 'Taxas de Câmbios',
                'db_table': 'currency_rates',
                'ordering': ['base_currency', 'to_currency', 'created_at', 'rate'],
            },
        ),
    ]
