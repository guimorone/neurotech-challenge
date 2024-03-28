# Generated by Django 5.0.3 on 2024-03-28 18:45

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
                ('base_currency', models.CharField(max_length=3)),
                ('to_currency', models.CharField(max_length=3)),
                ('rate', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Taxa de Câmbio',
                'verbose_name_plural': 'Taxas de Câmbios',
                'db_table': 'currency_rates',
                'ordering': ['base_currency', 'to_currency', 'rate', 'created_at'],
            },
        ),
        migrations.CreateModel(
            name='CurrenciesModel',
            fields=[
                ('currency', models.CharField(max_length=3, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('rates', models.ManyToManyField(to='api.currencyratesmodel')),
            ],
            options={
                'verbose_name': 'Moeda de Câmbio',
                'verbose_name_plural': 'Moedas de Câmbio',
                'db_table': 'currencies',
                'ordering': ['currency', 'updated_at', 'created_at'],
            },
        ),
    ]
