from django import forms
from datetime import date, datetime
from django.core.exceptions import ValidationError
from dateutil.relativedelta import relativedelta
from django.core.validators import MaxValueValidator, MinValueValidator 
from .models import *

class TicketForm(forms.Form):
    date = forms.DateField(label="Дата", 
                           initial=date.today(), 
                           widget=forms.DateInput(attrs={'type': 'date', 
                                                         "min" : date.today(), 
                                                         "max" : "2024-12-31"}),)
    excursion = forms.BooleanField(label="Экскурсия", required=False)
    feeding = forms.BooleanField(label="Кормление", required=False)
    photosession = forms.BooleanField(label="Фотосессия", required=False)
    promocode = forms.CharField(max_length=6, label="Промокод", required=False)
    def clean_date(self):
        data = self.cleaned_data['date']
        if data < date.today():
            raise ValidationError("Только будущие числа")
        return data
    
class AddPromocodeForm(forms.ModelForm):
    class Meta:
        model = Promocode
        fields = "__all__"

class AddAnimalForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Получаем экземпляр модели, если он был передан в конструктор формы
        instance = kwargs.pop('instance', None)
        # Если был передан экземпляр модели, заполняем поле DateField его значением
        if instance:
            self.initial['date_of_receipt'] = instance.date_of_receipt.strftime("%Y-%m-%d")
            self.initial['date_of_birth'] = instance.date_of_birth.strftime("%Y-%m-%d")
    class Meta:
        model = Animal
        fields = "__all__"  
        widgets = {
            'description': forms.Textarea(attrs={'cols': 40, 'rows': 5}),
            'date_of_receipt': forms.DateInput(attrs={'type': 'date', 
                                                      "max" : date.today()}),
            'date_of_birth': forms.DateInput(attrs={'type': 'date',
                                                    "max" : date.today()}),
            # 'image': forms.FileInput(attrs={'type': 'file', 'value': 'zoopark/static/media/images/no.jpg'}),                                       
        }    

class AddFeedbackForm(forms.ModelForm):
    class Meta:
        model = Feedback
        fields = ['text', 'mark']