import re
from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError


class Position(models.Model):
    name = models.CharField(max_length=20, verbose_name="Должность")
    salary = models.PositiveIntegerField(verbose_name="Зарплата")
    class Meta:
        verbose_name = "Должность"
        verbose_name_plural = "Должности"
    def __str__(self) -> str:
        return f"{self.name}"
    
class User(AbstractUser):
    # def phone_number_validator(value):
    #     phone_regex = r'^\+375 \(?(17|29|33|44)\)? [0-9]{3}-[0-9]{2}-[0-9]{2}$'
    #     if not re.match(phone_regex, value):
    #         raise ValidationError(
    #             message="Неверный формат номера телефона. +375 (XX) XXX-XX-XX",
    #             params={'value': value},
    #         )
    first_name = models.CharField(default="Имя", max_length=20, verbose_name="Имя")
    last_name = models.CharField(default="Фамилия", max_length=20, verbose_name="Фамилия")
    phone_number_validator = RegexValidator(regex=r'^\+375 \(?(17|29|33|44)\)? [0-9]{3}-[0-9]{2}-[0-9]{2}$', message="Неверный формат номера телефона. +375 (XX) XXX-XX-XX")
    phone = models.CharField(default="", validators=[phone_number_validator], max_length=19, verbose_name="Телефон")
    date_of_birth = models.DateField(verbose_name="Дата рождения", blank=True, null=True)
    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
    @property
    def age(self):
        if self.date_of_birth:
            today = date.today()
            age = today.year - self.date_of_birth.year
            if today.month < self.date_of_birth.month or (today.month == self.date_of_birth.month and today.day < self.date_of_birth.day):
                age -= 1
            return age
        return None
    
    
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key = True, verbose_name="Пользователь")
    position = models.ForeignKey(Position, on_delete = models.CASCADE, verbose_name="Должность")
    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name}"
