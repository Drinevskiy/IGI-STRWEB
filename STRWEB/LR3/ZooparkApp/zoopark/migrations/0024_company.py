# Generated by Django 5.0.4 on 2024-10-01 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zoopark', '0023_delete_company'),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('info', models.CharField(max_length=150, verbose_name='Описание')),
                ('history', models.CharField(max_length=250, verbose_name='История')),
                ('requisites', models.CharField(max_length=50, verbose_name='Реквизиты')),
                ('video', models.FileField(upload_to='videos/', verbose_name='Видео')),
                ('image', models.ImageField(default='images/zoopark_icon.jpg', upload_to='', verbose_name='Логотип')),
            ],
            options={
                'verbose_name': 'Компания',
                'verbose_name_plural': 'Компании',
            },
        ),
    ]
