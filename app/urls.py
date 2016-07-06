from django.conf.urls import include, url
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^calendarioanual$', views.calendarioanual),
    url(r'^horario$', views.horarioAsignaturas),
    url(r'^getAsignaturas$', views.getAsignaturas),
    url(r'^obtenergrupos$', views.obtenerGrupos),
    url(r'^asignaturas$', views.obtenerTodasLasAsignaturas),
    url(r'^grados$', views.getGrados)
]
