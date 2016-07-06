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
        body_unicode = request.body.decode('utf-8')
        received_json_data = json.loads(body_unicode)
        json.dumps(received_json_data)
        server = SOAPProxy('www.abj-ws-devborja.c9users.io:8082')
        res = server.crearCalendario(received_json_data)
        calendario = {}
        calendario["calendario"] = res
        return HttpResponse(json.dumps(calendario))

@csrf_exempt
def horarioAsignaturas(request):
    if request.method == "GET":
        return render(request, 'horario.html', {})
    else:
        body_unicode = request.body.decode('utf-8')
        received_json_data = json.loads(body_unicode)
        json.dumps(received_json_data)
        server = SOAPProxy('www.abj-ws-devborja.c9users.io:8082')
        #res = server.crearCalendario(received_json_data)
        calendario = {}
        calendario["calendario"] = res
        return HttpResponse(json.dumps(calendario))

@csrf_exempt
def getAsignaturas(request):

    server = SOAPProxy('www.abj-ws-devborja.c9users.io:8080')
    res = json.loads(server.obtenerAsignaturasGradoInformatica())
    data = []
    for asig in res["asignaturas"]:
        obj = {}
        obj["label"] = asig["nombreAsignatura"]
        obj["value"] = asig["codigo"]
        data.append(obj)
    lista = {}
    lista["asignaturas"] = data
    return HttpResponse(json.dumps(lista))

@csrf_exempt
def obtenerGrupos(request):
    if request.method == "POST":
        server = SOAPProxy('www.abj-ws-devborja.c9users.io:8080')
        server2 = SOAPProxy('www.abj-ws-devborja.c9users.io:8082')
        body_unicode = request.body.decode('utf-8')
        received_json_data = json.loads(body_unicode)
        data = []
        for item in received_json_data["data"]:
            obj = {}
            res = server.obtenerGruposAsignaturaInformatica(item["codigoAsig"])
            res = json.loads(server.obtenerHorarioAsignatura(item["codigoAsig"], res["grupos"][0]))
            obj["nombreAsignatura"] = res["nombreAsignatura"]
            obj["eventos"] = res["horarioGrupoAsignatura"][0]["eventos"]
            data.append(obj)
        print(json.dumps(data))
        horario = server2.crearHorario(json.dumps(data))
        calendario = {}
        calendario["calendario"] = horario
        print(horario)
        return HttpResponse(json.dumps(calendario))

@csrf_exempt
def obtenerTodasLasAsignaturas(request):
    server = SOAPProxy('www.abj-ws-devborja.c9users.io:8080')
    res = json.loads(server.obtenerAsignaturasGradoInformatica())
    return HttpResponse(json.dumps(res, sort_keys=True, indent=4))

def getGrados(request):
    if request.method == "GET":
        codigo = request.GET.get('cod')
        server = SOAPProxy('www.abj-ws-devborja.c9users.io:8080')
        res = server.obtenerGruposAsignaturaInformatica(codigo)
        return HttpResponse(res)
