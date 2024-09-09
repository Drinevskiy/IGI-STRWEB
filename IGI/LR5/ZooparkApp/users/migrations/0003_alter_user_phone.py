# Generated by Django 5.0.6 on 2024-09-05 14:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_employee_phone_user_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='phone',
            field=models.CharField(default='', max_length=19, validators=[django.core.validators.RegexValidator(message='Неверный формат номера телефона. +375 (XX) XXX-XX-XX', regex='^\\+375 \\(?(17|29|33|44)\\)? [0-9]{3}-[0-9]{2}-[0-9]{2}$')], verbose_name='Телефон'),
        ),
    ]
