from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Count
from django.contrib import auth
from django.utils import timezone
from zoopark.models import *
from .forms import *
from last_time import last_change_datetime
import logging
import calendar
import pytz
from tzlocal import get_localzone


def is_authenticated(user):
    return user.is_authenticated

def is_unauthenticated(user):
    return not user.is_authenticated

# Create your views here.
@user_passes_test(is_authenticated)
def profile(request):
    user = request.user
    context = {"title" : "Профиль",
               "user" : request.user}
    if not user.is_staff and not user.is_superuser:
        tickets = Ticket.objects.filter(visitor = user)
        context["tickets"] = tickets 
    if user.is_staff:
        employee = Employee.objects.filter(user = user)
        animals = Animal.objects.filter(employee = employee.first())
        zip_list2 = []
        aviaries = Aviary.objects.annotate(num_animals = Count("animal"))
        for animal in animals:
            aviary = aviaries.get(pk=animal.aviary.id)
            zip_list2.append([animal, animal.feed.all(), aviary])
        context["animals"] = zip_list2
    text_calendar = calendar.TextCalendar().formatyear(2024)
    context["text_calendar"] = text_calendar
    context["today"] = timezone.now()

    # local_tz = get_localzone()
    # now_local = datetime.now(local_tz)
    context["user_tz"] = timezone.get_current_timezone()
    # context["user_tz"] = datetime.now(local_tz).astimezone(local_tz)

    context["utc"] = datetime.now(tz=pytz.utc)    
    # context["utc"] = datetime.now(local_tz)    
    return render(request, "users/profile.html", context)


@user_passes_test(is_unauthenticated)
def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = auth.authenticate(request, username=username, password=password)
            if user is not None:
                auth.login(request, user)
                logging.info(f"{request.user.last_name} {request.user.first_name} вошел в аккаунт.")    
                return HttpResponseRedirect(reverse('zoopark:index'))
    else:
        form = LoginForm()
    context = {"title" : "Вход",
            "form" : LoginForm()}
    return render(request, "users/login.html", context)

@user_passes_test(is_authenticated)
def logoutUser(request):
    logging.info(f"{request.user.last_name} {request.user.first_name} вышел из аккаунта.")    
    logout(request)
    return redirect('zoopark:index')

@user_passes_test(is_unauthenticated)
def registration(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth.login(request, user)
            logging.info(f"{user.last_name} {user.first_name} зарегистрировался на сайте.")
            return HttpResponseRedirect(reverse('zoopark:index')) 
    else:
        form = RegistrationForm()
    return render(request, 'users/registration.html', {'form': form, 'msg': 1})