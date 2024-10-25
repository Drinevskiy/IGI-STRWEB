from django.test import TestCase
from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Position, Employee
from .forms import LoginForm, RegistrationForm
from datetime import date, timedelta
from django.test import Client, TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from zoopark.models import *

User = get_user_model()

class PositionTestCase(TestCase):
    def test_position_creation(self):
        position = Position.objects.create(name="Manager", salary=5000)
        self.assertEqual(str(position), "Manager")
        self.assertEqual(position.name, "Manager")
        self.assertEqual(position.salary, 5000)

class UserTestCase(TestCase):
    def test_user_creation(self):
        user = User.objects.create_user(
            username="testuser",
            first_name="Test",
            last_name="User",
            phone="+375 (29) 123-45-67",
            date_of_birth=date(1990, 1, 1)
        )
        self.assertEqual(user.first_name, "Test")
        self.assertEqual(user.last_name, "User")
        self.assertEqual(user.phone, "+375 (29) 123-45-67")
        self.assertEqual(user.date_of_birth, date(1990, 1, 1))
        self.assertEqual(user.age, 34)


class EmployeeTestCase(TestCase):
    def setUp(self):
        self.position = Position.objects.create(name="Manager", salary=5000)
        self.user = User.objects.create_user(
            username="testuser",
            first_name="Test",
            last_name="User",
            phone="+375 (29) 123-45-67",
            date_of_birth=date(1990, 1, 1)
        )

    def test_employee_creation(self):
        employee = Employee.objects.create(user=self.user, position=self.position)
        self.assertEqual(str(employee), "Test User")
        self.assertEqual(employee.user, self.user)
        self.assertEqual(employee.position, self.position)

class FormTests(TestCase):
    def setUp(self):
        self.valid_data = {
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'password': 'testpasswordD6',
            'password1': 'testpasswordD6',
            'password2': 'testpasswordD6',
            'date_of_birth': date.today() - timedelta(days=365*19),
            'phone': '+375 (29) 452-96-90'
        }

    def test_login_form_valid(self):
        form = LoginForm(data=self.valid_data)
        self.assertTrue(form.is_valid())

    def test_login_form_invalid(self):
        form = LoginForm(data={
            'username': '',
            'password': ''
        })
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)
        self.assertIn('password', form.errors)

    def test_registration_form_valid(self):
        form = RegistrationForm(data=self.valid_data)
        self.assertTrue(form.is_valid())

    def test_registration_form_invalid_password(self):
        form = RegistrationForm(data={
            **self.valid_data,
            'password1': 'testpassword',
            'password2': 'wrongpassword'
        })
        self.assertFalse(form.is_valid())
        self.assertIn('password2', form.errors)

    def test_registration_form_invalid_email(self):
        form = RegistrationForm(data={
            **self.valid_data,
            'email': 'invalidemail'
        })
        self.assertFalse(form.is_valid())
        self.assertIn('email', form.errors)

    def test_registration_form_invalid_date_of_birth(self):
        form = RegistrationForm(data={
            **self.valid_data,
            'date_of_birth': date.today() - timedelta(days=365*17)
        })
        self.assertFalse(form.is_valid())
        self.assertIn('date_of_birth', form.errors)

class ViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
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
        Animal.objects.create(name='Test Animal',
                            type=self.animal_type,
                            family=self.family,
                            employee=self.employee,
                            description="Description",
                            aviary=self.aviary,
                            daily_norm=3,
                            date_of_receipt=date(2024, 5, 17),
                            date_of_birth=date(2024, 5, 17),
                            feeding_schedule='Schedule').feed.set([self.feed])
    def test_profile_view(self):
        # Test for authenticated user
        self.client.force_login(self.user)
        response = self.client.get(reverse('users:profile'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('tickets', response.context)
        self.assertIn('user', response.context)

        # Test for staff user
        self.client.force_login(self.staff_user)
        response = self.client.get(reverse('users:profile'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('animals', response.context)
        self.assertIn('text_calendar', response.context)
        self.assertIn('user_tz', response.context)
        self.assertIn('today', response.context)
        self.assertIn('utc', response.context)

    def test_login_view(self):
        # Test for unauthenticated user
        response = self.client.get(reverse('users:login'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('form', response.context)

        # Test for valid login
        response = self.client.post(reverse('users:login'), {'username': 'testuser', 'password': 'testpass'})
        self.assertRedirects(response, reverse('zoopark:index'))
        self.assertTrue(self.client.session.get('_auth_user_id'))

    def test_logout_view(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse('users:logout'))
        self.assertRedirects(response, reverse('zoopark:index'))
        self.assertFalse(self.client.session.get('_auth_user_id'))

    def test_registration_view(self):
        # Test for unauthenticated user
        response = self.client.get(reverse('users:registration'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('form', response.context)

        # Test for valid registration
        data = {
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'password1': 'testpasswordD6',
            'password2': 'testpasswordD6',
            'date_of_birth': date.today() - timedelta(days=365*19),
            'phone': '+375 (29) 452-96-90'
        }
        response = self.client.post(reverse('users:registration'), data)
        self.assertEqual(response.status_code, 200)
        # self.assertRedirects(response, reverse('zoopark:index'))
        self.assertTrue(User.objects.filter(username='testuser').exists())