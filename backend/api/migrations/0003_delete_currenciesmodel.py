# Generated by Django 5.0.3 on 2024-03-29 00:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_currencyratesmodel_options'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CurrenciesModel',
        ),
    ]