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

    server = SOAPProxy('www.abj-ws-devborja.c9users.io:8081')
    res = json.loads(server.obtenerAsignaturasGradoInformatica())
    data = {}
    data["1"] = []
    data["2"] = []
    data["3"] = []
    data["4"] = []
    data["X"] = []
    for asig in res["asignaturas"]:
        obj = {}
        obj["nombreAsignatura"] = asig["nombreAsignatura"]
        obj["codigo"] = asig["codigo"]
        if asig["curso"] == "1":
            data["1"].append(obj)
        elif asig["curso"] == "2":
            data["2"].append(obj)
        elif asig["curso"] == "3":
            data["3"].append(obj)
        elif asig["curso"] == "4":
            data["4"].append(obj)
        else:
            data["X"].append(obj)
    return HttpResponse(json.dumps(data))

@csrf_exempt
def obtenerGrupos(request):
    if request.method == "POST":
        server = SOAPProxy('www.abj-ws-devborja.c9users.io:8081')
        server2 = SOAPProxy('www.abj-ws-devborja.c9users.io:8082')
        body_unicode = request.body.decode('utf-8')
        received_json_data = json.loads(body_unicode)
        data = []
        for key, value in received_json_data.iteritems():
            for item in value:
                obj = {}
                res = server.obtenerGruposAsignaturaInformatica(item, key)
                res = json.loads(server.obtenerHorarioAsignatura(item, res["grupos"][0]))
                obj["nombreAsignatura"] = res["nombreAsignatura"]
                obj["eventos"] = res["horarioGrupoAsignatura"][0]["eventos"]
                data.append(obj)
        horario = server2.crearHorario(json.dumps(data))
        calendario = {}
        calendario["calendario"] = horario
        return HttpResponse(json.dumps(calendario))

@csrf_exempt
def obtenerTodasLasAsignaturas(request):
    server = SOAPProxy('www.abj-ws-devborja.c9users.io:8081')
    res = json.loads(server.obtenerAsignaturasGradoInformatica())
    return HttpResponse(json.dumps(res, sort_keys=True, indent=4))

def getGrados(request):
    if request.method == "GET":
        codigo = request.GET.get('cod')
        server = SOAPProxy('www.abj-ws-devborja.c9users.io:8080')
        res = server.obtenerGruposAsignaturaInformatica(codigo)
        return HttpResponse(res)
