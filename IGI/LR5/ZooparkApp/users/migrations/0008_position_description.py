# Generated by Django 5.0.6 on 2024-09-06 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_employee_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='position',
            name='description',
            field=models.CharField(default='Hard work', max_length=200, verbose_name='Описание'),
        ),
    ]
