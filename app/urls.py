from django.conf.urls import include, url
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^calendarioanual$', views.calendarioanual)
]
