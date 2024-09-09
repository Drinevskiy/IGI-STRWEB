from django import forms
from django.contrib.auth.forms import AuthenticationForm
from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import MaxValueValidator, MinValueValidator 
from users.models import User

class LoginForm(forms.Form):
    # class Meta:
    #     model = User
    username = forms.CharField(
        label="",
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Имя пользователя'
            }
        )
    )
    password = forms.CharField(
        label="",
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Пароль'
            }
        )
    )

class RegistrationForm(UserCreationForm):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Имя пользователя'
            }
        )
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Пароль'
            }
        )
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Повторите пароль'
            }
        )
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Введите почту'
            }
        )
    )
    first_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Введите имя'
            }
        )
    )
    last_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Введите фамилию'
            }
        )
    )
    date_of_birth = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 
                                      "max" : date.today()-relativedelta(years=18),
                                      'class': 'form-control'}),
    )
    def clean_date_of_birth(self):
        data = self.cleaned_data['date_of_birth']
        if data > date.today()-relativedelta(years=18):
            raise ValidationError("Возрастное ограничение 18+")
        return data
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'date_of_birth', 'phone')# 'address', 'phone', )
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date', 
                                                    "max" : date.today()-relativedelta(years=18),
                                                    'class': 'form-control'}),
        }