from django.test import TestCase
from datetime import date, timedelta
from django.contrib.auth.models import User
from .models import *
from users.models import *
from django.core.exceptions import ValidationError
from .forms import TicketForm, AddPromocodeForm, AddAnimalForm

# Create your tests here.

class CountryModelTestCase(TestCase):
    def test_create_country(self):
        country = Country.objects.create(name="Россия", climat="Умеренный")
        self.assertEqual(country.name, "Россия")
        self.assertEqual(country.climat, "Умеренный")

    def test_str_method(self):
        country = Country.objects.create(name="Канада", climat="Холодный")
        self.assertEqual(str(country), "Канада")

class AnimalTypeModelTestCase(TestCase):
    def test_create_animal_type(self):
        country = Country.objects.create(name="Бразилия", climat="Тропический")
        animal_type = AnimalType.objects.create(name="Лев", country=country)
        self.assertEqual(animal_type.name, "Лев")
        self.assertEqual(animal_type.country, country)

    def test_str_method(self):
        country = Country.objects.create(name="Австралия", climat="Субтропический")
        animal_type = AnimalType.objects.create(name="Кенгуру", country=country)
        self.assertEqual(str(animal_type), "Кенгуру")

class AnimalFamilyModelTestCase(TestCase):
    def test_create_animal_family(self):
        family = AnimalFamily.objects.create(name="Кошачьи", continent="Африка")
        self.assertEqual(family.name, "Кошачьи")
        self.assertEqual(family.continent, "Африка")

    def test_str_method(self):
        family = AnimalFamily.objects.create(name="Медвежьи", continent="Северная Америка")
        self.assertEqual(str(family), "Медвежьи")

class AviaryModelTestCase(TestCase):
    def test_create_aviary(self):
        aviary = Aviary.objects.create(name="Вольер для львов", square=500, reservoir=True, heating=True)
        self.assertEqual(aviary.name, "Вольер для львов")
        self.assertEqual(aviary.square, 500)
        self.assertTrue(aviary.reservoir)
        self.assertTrue(aviary.heating)

    def test_str_method(self):
        aviary = Aviary.objects.create(name="Среда обитания для пингвинов", square=300, reservoir=True, heating=False)
        self.assertEqual(str(aviary), "Среда обитания для пингвинов")


class FeedModelTestCase(TestCase):
    def test_create_feed(self):
        feed = Feed.objects.create(name="Корм для львов", cost=500)
        self.assertEqual(feed.name, "Корм для львов")
        self.assertEqual(feed.cost, 500)

    def test_str_method(self):
        feed = Feed.objects.create(name="Корм для кенгуру", cost=300)
        self.assertEqual(str(feed), "Корм для кенгуру")

class AnimalModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.staff_user = User.objects.create_user(username='staffuser', password='staffpass', is_staff=True)
        self.position = Position.objects.create(name="Viewer", salary=1400)
        self.employee = Employee.objects.create(user=self.staff_user, position=self.position)
        self.aviary = Aviary.objects.create(name='Test Aviary', square=432, reservoir=False, heating=True)
        self.feed = Feed.objects.create(name="Feed", cost=4)
        self.ticket = Ticket.objects.create(visitor=self.user, date=date(2024, 5, 17), excursion=True, feeding=False, photosession=True)
        self.country = Country.objects.create(name='Test Country', climat="Test Climat")
        self.family = AnimalFamily.objects.create(name='Test Family', continent='Test Continent')
        self.animal_type = AnimalType.objects.create(name='Test Type', country=self.country)
        self.animal = Animal.objects.create(name='Test Animal',
                            type=self.animal_type,
                            family=self.family,
                            employee=self.employee,
                            description="Description",
                            aviary=self.aviary,
                            daily_norm=3,
                            date_of_receipt=date(2024, 5, 17),
                            date_of_birth=date(2020, 3, 15),
                            feeding_schedule='Schedule')
        self.animal.feed.set([self.feed])
        self.animal.save()
    def test_create_animal(self):
        self.assertEqual(self.animal.name, 'Test Animal')
        self.assertEqual(self.animal.type, self.animal_type)
        self.assertEqual(self.animal.family, self.family)
        self.assertEqual(self.animal.employee, self.employee)
        self.assertEqual(self.animal.description, "Description")
        self.assertEqual(self.animal.aviary, self.aviary)
        self.assertEqual(self.animal.daily_norm, 3)
        self.assertEqual(self.animal.date_of_receipt, date(2024, 5, 17))
        self.assertEqual(self.animal.date_of_birth, date(2020, 3, 15))
        self.assertEqual(self.animal.feeding_schedule, 'Schedule')
        self.assertQuerysetEqual(self.animal.feed.all(), [self.feed], ordered=False)

    def test_str_method(self):
        self.assertEqual(str(self.animal), "Животное Test Animal")

    def test_age_property(self):
        animal = Animal.objects.get(name="Test Animal")
        self.assertEqual(animal.age, 4)

        animal.date_of_birth = date(2021, 12, 31)
        self.assertEqual(animal.age, 2)

        animal.date_of_birth = None
        self.assertIsNone(animal.age)

class PromocodeModelTestCase(TestCase):
    def test_create_promocode(self):
        promocode = Promocode.objects.create(name="SALE10", percentage=10)
        self.assertEqual(promocode.name, "SALE10")
        self.assertEqual(promocode.percentage, 10)

    def test_str_method(self):
        promocode = Promocode.objects.create(name="SALE20", percentage=20)
        self.assertEqual(str(promocode), "SALE20")

    # def test_percentage_validation(self):
    #     with self.assertRaises(ValidationError):
    #         Promocode.objects.create(name="SALE0", percentage=0)
    #         raise ValidationError("")
    #     with self.assertRaises(ValidationError):
    #         Promocode.objects.create(name="SALE101", percentage=101)
    #         raise ValidationError("")

class TicketModelTestCase(TestCase):
    def test_create_ticket(self):
        user = User.objects.create_user(username="testuser", password="testpass")
        promocode = Promocode.objects.create(name="SALE10", percentage=10)
        ticket = Ticket.objects.create(
            date=date.today(),
            excursion=True,
            feeding=True,
            photosession=True,
            promocode=promocode,
            visitor=user
        )
        self.assertEqual(ticket.date, date.today())
        self.assertTrue(ticket.excursion)
        self.assertTrue(ticket.feeding)
        self.assertTrue(ticket.photosession)
        self.assertEqual(ticket.promocode, promocode)
        self.assertEqual(ticket.visitor, user)
        self.assertEqual(ticket.cost, 45.0)

    def test_cost_property(self):
        user = User.objects.create_user(username="testuser", password="testpass")
        ticket = Ticket.objects.create(
            date=date.today(),
            excursion=False,
            feeding=False,
            photosession=False,
            visitor=user
        )
        self.assertEqual(ticket.cost, 12.0)

        ticket.excursion = True
        self.assertEqual(ticket.cost, 32.0)

        ticket.feeding = True
        self.assertEqual(ticket.cost, 35.0)

        ticket.photosession = True
        self.assertEqual(ticket.cost, 50.0)

        promocode = Promocode.objects.create(name="SALE20", percentage=20)
        ticket.promocode = promocode
        self.assertEqual(ticket.cost, 40.0)

    def test_str_method(self):
        user = User.objects.create_user(username="testuser", password="testpass")
        ticket = Ticket.objects.create(
            date=date.today(),
            visitor=user,
            excursion=False,
            feeding=False,
            photosession=False,
        )
        self.assertEqual(str(ticket), "Билет")        


class TicketFormTestCase(TestCase):
    def test_ticket_form_valid_data(self):
        data = {
            'date': date.today(),
            'excursion': True,
            'feeding': True,
            'photosession': True,
            'promocode': 'SALE10'
        }
        form = TicketForm(data)
        self.assertTrue(form.is_valid())

    def test_ticket_form_invalid_date(self):
        data = {
            'date': date.today() - timedelta(days=1),
            'excursion': True,
            'feeding': True,
            'photosession': True,
            'promocode': 'SALE10'
        }
        form = TicketForm(data)
        self.assertFalse(form.is_valid())
        self.assertIn('date', form.errors)

    def test_ticket_form_promocode_max_length(self):
        data = {
            'date': date.today(),
            'excursion': True,
            'feeding': True,
            'photosession': True,
            'promocode': 'SALE123'
        }
        form = TicketForm(data)
        self.assertFalse(form.is_valid())
        self.assertIn('promocode', form.errors)

class AddPromocodeFormTestCase(TestCase):
    def test_add_promocode_form_valid_data(self):
        data = {
            'name': 'SALE10',
            'percentage': 10
        }
        form = AddPromocodeForm(data)
        self.assertTrue(form.is_valid())
        form.save()
        self.assertEqual(Promocode.objects.count(), 1)

    def test_add_promocode_form_invalid_percentage(self):
        data = {
            'name': 'SALE0',
            'percentage': 0
        }
        form = AddPromocodeForm(data)
        self.assertFalse(form.is_valid())
        self.assertIn('percentage', form.errors)

class AddAnimalFormTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.staff_user = User.objects.create_user(username='staffuser', password='staffpass', is_staff=True)
        self.position = Position.objects.create(name="Viewer", salary=1400)
        self.employee = Employee.objects.create(user=self.staff_user, position=self.position)
        self.aviary = Aviary.objects.create(name='Test Aviary', square=432, reservoir=False, heating=True)
        self.feed = Feed.objects.create(name="Feed", cost=4)
        self.ticket = Ticket.objects.create(visitor=self.user, date=date(2024, 5, 17), excursion=True, feeding=False, photosession=True)
        self.country = Country.objects.create(name='Test Country', climat="Test Climat")
        self.family = AnimalFamily.objects.create(name='Test Family', continent='Test Continent')
        self.animal_type = AnimalType.objects.create(name='Test Type', country=self.country)
        self.animal = Animal.objects.create(name='Test Animal',
                            type=self.animal_type,
                            family=self.family,
                            employee=self.employee,
                            description="Description",
                            aviary=self.aviary,
                            daily_norm=3,
                            date_of_receipt=date(2024, 5, 17),
                            date_of_birth=date(2020, 3, 15),
                            feeding_schedule='Schedule')
        self.animal.feed.set([self.feed])
        self.animal.save()
    # def test_add_animal_form_valid_data(self):
    #     data = {
    #         'name': self.name,
    #         'type': self.animal_type,
    #         'family': self.animal_family,
    #         'description': "Description",
    #         'aviary': self.aviary,
    #         'daily_norm': 3,
    #         'date_of_receipt': date.today(),
    #         'date_of_birth': date.today() - timedelta(days=365),
    #         'feeding_schedule': 'Schedule',
    #         'feed': self.feed,
    #         'employee': self.employee
    #     }
    #     form = AddAnimalForm(data)
    #     self.assertTrue(form.is_valid())
    #     form.save()
    #     self.assertEqual(Animal.objects.count(), 1)

    def test_add_animal_form_invalid_date_of_receipt(self):
        data = {
            'name': 'Fluffy',
            'species': 'Cat',
            'description': 'A cute cat',
            'date_of_receipt': date.today() + timedelta(days=1),
            'date_of_birth': date.today() - timedelta(days=365)
        }
        form = AddAnimalForm(data)
        self.assertFalse(form.is_valid())
        self.assertIn('date_of_receipt', form.errors)

    def test_add_animal_form_with_instance(self):
        form = AddAnimalForm(instance=self.animal)
        self.assertEqual(form.initial['date_of_receipt'], date(2024, 5, 17).strftime("%Y-%m-%d"))
        self.assertEqual(form.initial['date_of_birth'], date(2020, 3, 15).strftime("%Y-%m-%d"))        