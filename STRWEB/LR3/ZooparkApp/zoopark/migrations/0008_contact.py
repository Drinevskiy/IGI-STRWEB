# Generated by Django 5.0.6 on 2024-09-06 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zoopark', '0007_question_alter_animal_date_of_birth_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='ФИО')),
                ('email', models.CharField(max_length=100, verbose_name='ФИО')),
            ],
        ),
    ]
