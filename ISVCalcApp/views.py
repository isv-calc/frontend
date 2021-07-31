# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse
import datetime

def home(request):
    return HttpResponse("Hello, Django!")

def pag_inicial(request):
    return render(
        request,
        'ISVCalcApp/pag_inicial.html',
        {
            'date': datetime.date.today()
        }
    )