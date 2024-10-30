from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from datetime import datetime, timedelta
from django.db.models import Count, Sum
from django.contrib.auth.decorators import login_required, user_passes_test
from .services.cat_facts import get_fact
from .services.dog_photos import get_photo
from .models import *
from .forms import *
from last_time import last_change_datetime
import plotly.graph_objects as go
import logging
import json
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def index(request):
    if request.method == "POST":
        options = SliderOptions.objects.all()[0]
        options.delay = request.POST.get('delay', 5000)
        options.loop = request.POST.get('loop', '') == 'loop'
        options.navs = request.POST.get('navs', '') == 'navs'
        options.pags = request.POST.get('pags', '') == 'pags'
        options.auto = request.POST.get('auto', '') == 'auto'
        options.stopMouseHover = request.POST.get('stopMouseHover', '') == 'stopMouseHover'
        options.save()
    name = request.GET.get("name", "")
    age = request.GET.get("age") == "on"
    # animals = Animal.objects.filter(name__icontains=name.lower() | name__icontains=name.upper()) 

    animals = Animal.objects.filter(name_lower__icontains=name.lower())
    # animals = Animal.objects.filter(name__icontains=name.upper())
    partners = Partner.objects.all()
    news = News.objects.order_by('-id')[:3]
    if age:
        animals = animals.order_by("date_of_birth")
    sliderOptions = SliderOptions.objects.all()[0]
    context = {"title" : "Главная",
               "animals" : animals,
               "partners" : partners,
               "news" : news,
               "sliderOptions" : sliderOptions }
    return render(request, "zoopark/index.html", context)

def animal_list_json(request):
    try:
        animals = Animal.objects.all()
        animal_data = [
            {
                'name': animal.name,
                'description': animal.description,
                'type': getattr(animal.type, 'name', str(animal.type)),
                'family': getattr(animal.family, 'name', str(animal.family)),
                'age': animal.age,
                'aviary': getattr(animal.aviary, 'name', str(animal.aviary)),
                'image': animal.image.url if animal.image else '/static/media/images/no.jpg'
            }
            for animal in animals
        ]
        return JsonResponse(animal_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def service(request):
    promocodes = Promocode.objects.filter(is_archive=False)
    promocodes_archive = Promocode.objects.filter(is_archive=True)
    context = {"title" : "Услуги",
               "promocodes" : promocodes,
               "promocodes_archive" : promocodes_archive}
    return render(request, "zoopark/service.html", context)

def about(request):
    company = Company.objects.all()[0]
    context = {"title" : "О нас",
               "company" : company}
    return render(request, "zoopark/about.html", context)

def news(request):
    news = News.objects.all()
    context = {"title" : "Новости",
               "news" : news}
    return render(request, "zoopark/news.html", context)

def new(request, pk):
    new = get_object_or_404(News, pk=pk)
    context = {"new": new}
    return render(request, "zoopark/new.html", context)

def questions(request):
    questions = Question.objects.all()
    context = {"title" : "Вопросы",
               "questions" : questions}
    return render(request, "zoopark/questions.html", context)

def contacts(request):
    contacts = Employee.objects.all()
    context = {"title" : "Контакты",
               "contacts" : contacts}
    return render(request, "zoopark/contacts.html", context)

def vacancies(request):
    vacancies = Vacancy.objects.all()
    context = {"title" : "Вакансии",
               "vacancies" : vacancies}
    return render(request, "zoopark/vacancies.html", context)

def politics(request):
    context = {"title" : "Политика конфиденциальности"}
    return render(request, "zoopark/politics.html", context)

def feedbacks(request):
    feedbacks = Feedback.objects.all()
    context = {"title" : "Отзывы",
               "feedbacks" : feedbacks,
               "marks" : list(range(1,6))}
    return render(request, "zoopark/feedbacks.html", context)

def add_feedback(request):
    form = AddFeedbackForm(request.POST)
    context = {"title" : "Добавить отзыв",
               "success" : "",
               "form" : form}
    user = request.user
    if request.method == 'POST':
        if form.is_valid():
            text = request.POST.get('text')
            mark = request.POST.get('mark')
            Feedback.objects.create(user=user,
                                    text=text,
                                    mark=mark)
            context["success"] = "Отзыв добавлен"
        return redirect("zoopark:feedbacks")
    return render(request, "zoopark/add_feedback.html", context)

def payment(request):
    sum = 0
    if request.method == 'POST':
        tickets_paid = Ticket.objects.filter(visitor = request.user, paid = False).update(paid = True)
        return redirect("users:profile")
    else:
        tickets_paid = Ticket.objects.filter(visitor = request.user, paid = False)
        for ticket in tickets_paid:
            sum = sum + ticket.full_cost
        context = {"title" : "Оплата",
                "sum" : sum,
                "tickets" : tickets_paid}    
        return render(request, "zoopark/payment.html", context)

def payment2(request, pk):
    ticket = get_object_or_404(Ticket, pk=pk)
    ticket.paid = True
    ticket.save()
    return redirect("users:profile")

def other(request):
    context = {"title" : "Прочее"}
    return render(request, "zoopark/other.html", context)

def is_user(user):
    return not user.is_superuser and not user.is_staff

def is_authenticated_user(user):
    return not user.is_superuser and not user.is_staff and user.is_authenticated

def is_staff(user):
    return user.is_staff

def is_superuser(user):
    return user.is_superuser

@user_passes_test(is_authenticated_user)
def tickets(request):
    if request.method == "POST":
        date = datetime.strptime(request.POST.get("date"), "%Y-%m-%d")
        excursion = request.POST.get("excursion", False) == 'on'
        feeding = request.POST.get("feeding", False) == 'on'
        photosession = request.POST.get("photosession", False) == 'on'
        promocode = request.POST.get("promocode", '')
        user = request.user
        try:
            promo = Promocode.objects.filter(name=promocode).get()
            ticket = Ticket.objects.create(date=date, 
                                excursion=excursion, 
                                feeding=feeding, 
                                photosession=photosession, 
                                promocode=promo,
                                visitor=user)
        except:
            ticket = Ticket.objects.create(date=date, 
                                excursion=excursion, 
                                feeding=feeding, 
                                photosession=photosession, 
                                visitor=user)
        last_change_datetime = datetime.now()
        logging.info(f"{request.user.last_name} {request.user.first_name} купил билет за {ticket.cost} рублей.")    
    context = {"title" : "Билеты",
               "form" : TicketForm()}
    return render(request, "zoopark/tickets.html", context)

def animal(request, pk):
    animal = get_object_or_404(Animal, pk=pk)
    context = {"animal" : animal,
               "user" : request.user}
    return render(request, "zoopark/animal.html", context)

@user_passes_test(is_superuser)
def statistic(request):
    # Получение всех сотрудников
    employees = Employee.objects.all()
    zip_list = []
    for employee in employees:
        aviaries = Animal.objects.filter(employee = employee).values_list("aviary__name", flat=True).distinct()
        zip_list.append([employee, aviaries])
    context = {"title" : "Статистика",
               'zip_list' : zip_list}
    # Получение всех вольеров
    aviaries = Aviary.objects.annotate(num_animals = Count("animal"))
    context["aviaries"] = aviaries
    # Получение всех животных
    recently = request.GET.get("recently") == "on"
    animals = None
    if recently:
        animals = Animal.objects.filter(date_of_receipt__gt=datetime.now()-timedelta(days=182))
    else:     
        animals = Animal.objects.all()
    zip_list2 = []
    for animal in animals:
        zip_list2.append([animal, animal.feed.all()])
    context["animals"] = zip_list2
    # Получение данных о корме и видах в вольере
    aviary_id = request.GET.get("aviary")
    if aviary_id:
        aviary = Aviary.objects.get(pk=aviary_id)
        feed_sum = Animal.objects.filter(aviary=aviary).aggregate(feed_sum=Sum('daily_norm'))['feed_sum']
        types = Animal.objects.filter(aviary=aviary).values_list("type__name", flat=True).distinct()
        context['aviary_info'] = [aviary, feed_sum, types]  
    # Получение данных численности вида
    types = AnimalType.objects.all()
    type_id = request.GET.get("type")
    context['types'] = types
    if type_id:
        type = AnimalType.objects.get(pk=type_id)
        type_count = Animal.objects.filter(type=type).count()
        context['type_info'] = [type, type_count]
    # Получение данных численности семейства
    families = AnimalFamily.objects.values("name").distinct()
    family_name = request.GET.get("family")
    context['families'] = families
    if family_name:
        count = Animal.objects.filter(family__name=family_name).count()
        context['family_info'] = [family_name, count]
    # context["plot"] = get_graphic()    
    return render(request, "zoopark/statistic.html", context)

@user_passes_test(is_superuser)
def employees(request):
    employees = Employee.objects.all()
    context = {"title" : "Сотрудники"}
    context["employees"] = employees
    return render(request, "zoopark/employees.html", context)


def plot_statistic_animal_json(request):
    try:
        families = AnimalFamily.objects.values_list("name", flat=True).distinct()
        family_count = {}
        for family in families:
            count = (Animal.objects.filter(family__name=family).count())
            family_count[family] = count
        return JsonResponse(family_count, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def plot_statistic_aviary_json(request):
    try:
        aviaries = Aviary.objects.values_list("name", flat=True).distinct()
        aviary_count = {}
        for aviary in aviaries:
            count = (Animal.objects.filter(aviary__name=aviary).count())
            aviary_count[aviary] = count
        return JsonResponse(aviary_count, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def employees_json(request):
    try:
        employees = Employee.objects.all()
        employees_data = [
            {
                'username': employee.user.username,
                'first_name': employee.user.first_name,
                'last_name': employee.user.last_name,
                'position': employee.position.name,
                'description': employee.position.description,
                'salary': employee.position.salary,
                'email': employee.user.email,
                'phone': employee.user.phone,
                'image': employee.image.url if employee.image else '/static/media/images/no.jpg'
            }
            for employee in employees
        ]
        return JsonResponse(employees_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def positions_json(request):
    try:
        positions = Position.objects.all()
        positions_data = [
            {
                'name': position.name,
                'description': position.description,
                'salary': position.salary,
            }
            for position in positions
        ]
        return JsonResponse(positions_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def add_employee(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        _user = User.objects.create(
            username = data['last_name'],
            first_name = data['first_name'],
            last_name = data['last_name'],
            phone = data['phone'],
            email = data['email']
        )
        _position = Position.objects.filter(name = data['position']).first()
        employee = Employee.objects.create(
            user = _user,
            position = _position
        )
        return JsonResponse({'username': employee.user.username, 'message': 'Employee added successfully!'})
    return JsonResponse({'error': 'Invalid request'}, status=400)

def get_graphic():
    families = AnimalFamily.objects.values_list("name", flat=True).distinct()
    counts = []
    for family in families:
        counts.append(Animal.objects.filter(family__name=family).count())
    fig = go.Figure(data=[go.Bar(x=list(families), y=counts)])
    fig.update_layout(title='Численность семейств')

    plot = fig.to_html(full_html=False, default_height=500, default_width=700)
    return plot

@user_passes_test(is_superuser)
def management(request):
    animals = Animal.objects.all()
    context = {"title" : "Управление",
               "user" : request.user,
               "animals" : animals}
    return render(request, "zoopark/management.html", context)

@user_passes_test(is_superuser)
def add_animal(request):
    form = AddAnimalForm(request.POST, request.FILES)
    context = {"title" : "Добавить животное",
               "success" : "",
               "form" : form}
    if request.method == 'POST':
        if form.is_valid():
            name = request.POST.get('name')
            name_lower = request.POST.get('name_lower')
            type = request.POST.get('type')
            family = request.POST.get('family')
            employee = request.POST.get('employee')
            description = request.POST.get('description')
            aviary = request.POST.get('aviary')
            feed = request.POST.getlist('feed')
            daily_norm = request.POST.get('daily_norm')
            date_of_receipt = datetime.strptime(request.POST.get("date_of_receipt"), "%Y-%m-%d")
            date_of_birth = datetime.strptime(request.POST.get("date_of_birth"), "%Y-%m-%d")
            feeding_schedule = request.POST.get('feeding_schedule')
            image = request.FILES.get('image')
            animal = Animal.objects.create(name=name,
                                  name_lower = name_lower,
                                  type=AnimalType.objects.get(pk=type),
                                  family=AnimalFamily.objects.get(pk=family),
                                  employee=Employee.objects.get(pk=employee),
                                  description=description,
                                  aviary=Aviary.objects.get(pk=aviary),
                                  daily_norm=daily_norm,
                                  date_of_receipt=date_of_receipt,
                                  date_of_birth=date_of_birth,
                                  feeding_schedule=feeding_schedule,
                                  image=image).feed.set(feed)
            # Animal.save(animal)
            context["success"] = "Животное добавлено"
            global last_change_datetime
            last_change_datetime = datetime.now()
            logging.info(f"Имя: {name} Вид: {type} Семейство: {family} добавлен в зоопарк.")
    return render(request, "zoopark/add_animal.html", context)

@user_passes_test(is_superuser)
def edit_animal(request, pk):
    animal = get_object_or_404(Animal, pk=pk)
    form = AddAnimalForm(instance=animal)
    context = {"title" : "Изменить животное",
               "success" : "",
               "form" : form}
    if request.method == 'POST':
        form = AddAnimalForm(request.POST, request.FILES, instance=animal)
        if form.is_valid():
            animal = form.save()
            context["success"] = "Животное изменено"
            logging.info(f"Имя: {animal.name} Вид: {animal.type} Семейство: {animal.family.name} изменен.")
    return render(request, "zoopark/edit_animal.html", context)

@user_passes_test(is_superuser)
def delete_animal(request, pk):
    animal = Animal.objects.get(id=pk)
    name = animal.name
    type = animal.type
    family = animal.family
    animal.delete()
    logging.info(f"Имя: {name} Вид: {type} Семейство: {family} удален из зоопарка.")
    context = {"title" : "Удалить животное",
               "name" : name}
    global last_change_datetime
    last_change_datetime = datetime.now()
    return render(request, "zoopark/delete_animal.html", context)

def delete_ticket(request, pk):
    ticket = Ticket.objects.get(id=pk)
    ticket.delete()
    logging.info(f"Билет удален из профиля.")
    context = {"title" : "Удалить билет"}
    return redirect("users:profile")

    return render(request, "zoopark/delete_ticket.html", context)

@user_passes_test(is_superuser)
def add_promocode(request):
    form = AddPromocodeForm(request.POST)
    context = {"title" : "Добавить промокод",
               "success" : "",
               "form" : form}
    if request.method == 'POST':
        if form.is_valid():
            name = request.POST.get('name')
            percentage = request.POST.get('percentage')
            Promocode.objects.create(name=name,
                                     percentage=percentage)
            context["success"] = "Промокод добавлен"
            global last_change_datetime
            last_change_datetime = datetime.now()
            logging.info(f"Промокод {name} добавлен, скидка {percentage}%.")
            today = last_change_datetime
    return render(request, "zoopark/add_promocode.html", context)

@login_required
def cat_fact(request):
    context = {"title" : "Факт о кошках",
               "fact" : get_fact()}
    return render(request, "zoopark/cat_fact.html", context)

@login_required
def dog_photo(request):
    context = {"title" : "Фото собаки",
               "photo" : get_photo()}
    return render(request, "zoopark/dog_photo.html", context)
