import json

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect


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
        return HttpResponse(json.dumps(received_json_data))
