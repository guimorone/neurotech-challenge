# Generated by Django 5.0.3 on 2024-03-28 21:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='currencyratesmodel',
            options={'ordering': ['base_currency', 'to_currency', 'created_at', 'rate'], 'verbose_name': 'Taxa de Câmbio', 'verbose_name_plural': 'Taxas de Câmbios'},
        ),
    ]
