"""
URL configuration for ZooparkApp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

app_name='zoopark'

urlpatterns = [
    path("", views.index, name="index"),
    path("service/", views.service, name="service"),
    path("tickets/", views.tickets, name="tickets"),
    path("statistic/", views.statistic, name="statistic"),
    path("management/", views.management, name="management"),

    path(r'^animal/(?P<pk>\d+)/$', views.animal, name='animal'),
    path(r'^add-animal/$', views.add_animal, name='add-animal'),
    path(r'^edit-animal/(?P<pk>\d+)/$', views.edit_animal, name='edit-animal'),
    path(r'^delete-animal/(?P<pk>\d+)/$', views.delete_animal, name='delete-animal'),

    path(r'^add-promocode/$', views.add_promocode, name='add-promocode'),

    path(r'^cat-fact/$', views.cat_fact, name='cat-fact'),
    path(r'^dog-photo/$', views.dog_photo, name='dog-photo'),
]
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
