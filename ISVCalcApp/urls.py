from django.urls import path
from ISVCalcApp import views

urlpatterns = [
    path("", views.home, name="home"),
    path('isv/', views.pag_inicial, name="pag_inicial"),
]