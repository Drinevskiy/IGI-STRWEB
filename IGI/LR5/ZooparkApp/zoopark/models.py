from datetime import date
from django.db import models
from django.urls import reverse
from django.core.validators import MaxValueValidator, MinValueValidator 

from users.models import Employee, User, Position
# from zoopark.models import Animal
# from users.models import Employee

class Country(models.Model):
    name = models.CharField(max_length=25, verbose_name="Страна")
    climat = models.CharField(max_length=25, verbose_name="Климат")
    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"
    def __str__(self) -> str:
        return self.name
    
class AnimalType(models.Model):
    name = models.CharField(max_length=25, verbose_name="Вид")
    country = models.ForeignKey(Country, on_delete = models.CASCADE, verbose_name="Страна")
    class Meta:
        verbose_name = "Вид"
        verbose_name_plural = "Виды"
    def __str__(self) -> str:
        return self.name

class AnimalFamily(models.Model):
    name = models.CharField(max_length=25, verbose_name="Семейство")
    continent = models.CharField(max_length=20, verbose_name="Континент")
    class Meta:
        verbose_name = "Семейство"
        verbose_name_plural = "Семейства"
    def __str__(self) -> str:
        return f"{self.name}"
    
class Aviary(models.Model):
    name = models.CharField(max_length=25, verbose_name="Название")
    square = models.PositiveIntegerField(verbose_name="Площадь")
    reservoir = models.BooleanField(verbose_name="Водоем")
    heating = models.BooleanField(verbose_name="Отопление")
    class Meta:
        verbose_name = "Вольер"
        verbose_name_plural = "Вольеры"
    def __str__(self) -> str:
        return f"{self.name}"

class Feed(models.Model):
    name = models.CharField(max_length=30, verbose_name="Название")
    cost = models.PositiveIntegerField(verbose_name="Стоимость")
    class Meta:
        verbose_name = "Корм"
        verbose_name_plural = "Корма"
    def __str__(self) -> str:
        return f"{self.name}"

class Animal(models.Model):
    name = models.CharField(max_length=20, verbose_name="Имя")
    name_lower = models.CharField(max_length=20, verbose_name="Имя в нижнем регистре", blank=True)
    type = models.ForeignKey(AnimalType, on_delete = models.CASCADE, verbose_name="Вид")
    family = models.ForeignKey(AnimalFamily, on_delete = models.CASCADE, verbose_name="Семейство")
    employee = models.ForeignKey(Employee, on_delete = models.CASCADE, verbose_name="Сотрудник")
    description = models.CharField(max_length=150, verbose_name="Описание")
    aviary = models.ForeignKey(Aviary, on_delete = models.CASCADE, verbose_name="Вольер")
    feed = models.ManyToManyField(Feed, verbose_name="Корм")
    daily_norm = models.PositiveIntegerField(verbose_name="Дневная норма")
    date_of_receipt = models.DateField(validators=[MaxValueValidator(date.today())], verbose_name="Дата поступления")
    date_of_birth = models.DateField(validators=[MaxValueValidator(date.today())], verbose_name="Дата рождения")
    feeding_schedule = models.CharField(max_length=60, verbose_name="График кормления")
    image = models.ImageField(upload_to='images/', default='images/no.jpg', verbose_name="Фото животного")
    class Meta:
        verbose_name = "Животное"
        verbose_name_plural = "Животные"
    def __str__(self) -> str:
        return f"Животное {self.name}"
    @property
    def age(self):
        if self.date_of_birth:
            today = date.today()
            age = today.year - self.date_of_birth.year
            if today.month < self.date_of_birth.month or (today.month == self.date_of_birth.month and today.day < self.date_of_birth.day):
                age -= 1
            return age
        return None
    def save(self, *args, **kwargs):
        # Преобразуем имя в нижний регистр перед сохранением
        self.name_lower = self.name.lower()
        super().save(*args, **kwargs)  # Вызываем метод родительского класса

class Promocode(models.Model):
    name = models.CharField(max_length=6, verbose_name="Промокод")
    percentage = models.PositiveIntegerField(default=10, validators=[MinValueValidator(1), MaxValueValidator(100)], verbose_name="Процент")
    class Meta:
        verbose_name = "Промокод"
        verbose_name_plural = "Промокоды"
    def __str__(self) -> str:
        return f"{self.name}"
    
class Ticket(models.Model):
    date = models.DateField(verbose_name="Дата")
    excursion = models.BooleanField(verbose_name="Экскурсия")
    feeding = models.BooleanField(verbose_name="Кормление")
    photosession = models.BooleanField(verbose_name="Фотосессия")
    count = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(10)], verbose_name="Количество")
    paid = models.BooleanField(default=False, editable=True, verbose_name="Оплачен")
    promocode = models.ForeignKey(Promocode, on_delete = models.CASCADE, verbose_name="Промокод", blank=True, null=True)
    visitor = models.ForeignKey(User, on_delete = models.CASCADE, unique=False, verbose_name="Посетитель")
    @property
    def cost(self):
        sum = 12
        if self.excursion:
            sum+=20
        if self.feeding:
            sum+=3
        if self.photosession:
            sum+=15
        if self.promocode:
            sum=sum*(1-self.promocode.percentage/100)
        return round(sum, 2)
    @property
    def full_cost(self):
        return self.cost * self.count
    class Meta:
        verbose_name = "Билет"
        verbose_name_plural = "Билеты"
    def __str__(self) -> str:
        return "Билет"

class Partner(models.Model):
    name = models.CharField(max_length=15, verbose_name="Название")
    url = models.URLField(verbose_name="Адрес")
    image = models.ImageField(upload_to='images/', default='images/zoopark_icon.jpg', verbose_name="Логотип")
    class Meta:
        verbose_name = "Партнер"
        verbose_name_plural = "Партнеры"
    def __str__(self) -> str:
        return self.name
    
class Company(models.Model):
    info = models.CharField(max_length=150, verbose_name="Описание")
    history = models.CharField(max_length=250, verbose_name="История")
    certificate = models.CharField(max_length=250, verbose_name="Сертификат")
    requisites = models.CharField(max_length=50, verbose_name="Реквизиты")
    video = models.FileField(upload_to='videos/', verbose_name="Видео")
    image = models.ImageField(default='images/zoopark_icon.jpg', verbose_name="Логотип")
    class Meta:
        verbose_name = "Компания"
        verbose_name_plural = "Компании"
    def __str__(self) -> str:
        return self.info
    
class News(models.Model):
    header = models.CharField(max_length=100, verbose_name="Заголовок")
    short_description = models.CharField(max_length=300, verbose_name="Краткое описание")     
    description = models.CharField(max_length=1000, verbose_name="Описание")     
    image = models.ImageField(upload_to='images', verbose_name="Фото")
    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"
    def __str__(self) -> str:
        return self.header

class Question(models.Model):
    question = models.CharField(max_length=250, verbose_name="Вопрос")
    answer = models.CharField(max_length=250, verbose_name="Ответ")
    date = models.DateField(verbose_name="Дата")
    class Meta:
        verbose_name = "Вопрос"
        verbose_name_plural = "Вопросы"
    def __str__(self) -> str:
        return self.question

class Vacancy(models.Model):
    position = models.ForeignKey(Position, on_delete = models.CASCADE, verbose_name="Должность")
    count= models.PositiveIntegerField(default = 1, verbose_name="Количество") 
    class Meta:
        verbose_name = "Вакансия"
        verbose_name_plural = "Вакансии"
    def __str__(self) -> str:
        return self.position.name
    
class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, verbose_name="Пользователь")
    text = models.CharField(max_length=1000, verbose_name="Текст")
    mark = models.PositiveIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)], verbose_name="Оценка")
    date = models.DateField(auto_now=True, verbose_name="Дата")
    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
    def __str__(self) -> str:
        return "Отзыв"
    
    