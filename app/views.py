# -*- coding: utf-8 -*-
import json

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect

from SOAPpy import SOAPProxy


def index(request):
    return render(request, 'index.html', {})

@csrf_exempt
def calendarioanual(request):
    if request.method == 'GET':
        return render(request, 'calendarioanual.html', {})
    elif request.method == "POST":
        print("peticion post")
        body_unicode = request.body.decode('utf-8')
        received_json_data = json.loads(body_unicode)
        json.dumps(received_json_data)
        print(json.dumps(received_json_data))
        server = SOAPProxy('www.abj-ws-devborja.c9users.io:8082')
        res = server.crearCalendario(received_json_data)
        calendario = {}
        calendario["calendario"] = res
        return HttpResponse(json.dumps(calendario))
