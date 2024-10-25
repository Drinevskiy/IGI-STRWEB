# Generated by Django 5.0.4 on 2024-10-01 15:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zoopark', '0021_remove_company_certificate'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='certificate',
            field=models.ForeignKey(max_length=250, null=True, on_delete=django.db.models.deletion.SET_NULL, to='zoopark.certificate', verbose_name='Сертификат'),
        ),
    ]
