#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.shortcuts import render
from .models import *
from django.http import Http404, HttpResponse
import json
from dss.Serializer import serializer
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from i3jf.settings import ACCESSTOKEN,CHANNELSN,APPKEY,URL
from django.db.models import Q
import requests


@require_http_methods(["GET"])
def list_province_view(request):
    r = {}
    r['errno'] = 0
    r['province'] = [(lambda province: {'id': province.nid,"nid":province.id, 'name': province.name })(c) for c in list( ProvinceModel.objects.all() ) ]
    return HttpResponse( json.dumps(r) )

@require_http_methods(["GET"])
def list_city_view(request):
    data = request.GET
    # l = list( CityModel.objects.filter( province__code__exact = data['province_code'] ).all() )
    l = list(CityModel.objects.filter(pId=data.get("id")))
    r = {}
    r['errno'] = 0
    r['city'] = [(lambda city: {'id': city.nid,'pid': city.pId,"nid":city.id ,'name': city.name})(c) for c in l ]
    return HttpResponse(json.dumps(r))


@require_http_methods(["GET"])
def list_district_view(request):
    data = request.GET
    # l = list( DistrictModel.objects.filter( city__code__exact = data['city_code'] ).all() )
    l = list(DistrictModel.objects.filter(pId=data.get("id")))
    r = {}
    r['errno'] = 0
    r['district'] = [(lambda d: {'id': d.nid,'pid': d.pId,"nid":d.id, 'name': d.name})(c) for c in l ]
    return HttpResponse(json.dumps(r))

@require_http_methods(["GET"])
def list_town_view(request):
    data = request.GET
    nid = data.get("nid")
    pid = data.get("pid")
    # l = list( TownModel.objects.filter( Q(district__city__code__exact = data['city_code']) & Q(district__code__exact = data['district_code']) ).all() )
    l = list(TownModel.objects.filter(Q(pId=nid) & Q(secondPid=pid)))
    r = {}
    r['errno'] = 0
    r['town'] = [(lambda t: {'id': t.nid,'pid': t.pId,"nid":t.id ,'name': t.name})(c) for c in l ]
    return HttpResponse(json.dumps(r))

@require_http_methods(["GET"])
def fulladdress(request):
    r = {}
    response = requests.get(
        '{}fulladdress?data={{"appKey":"{}","accessToken":"{}","channel":"{}"}}'.format(URL, APPKEY, ACCESSTOKEN,
                                                                                        CHANNELSN))
    try :
        addrdict= json.loads(response.content)
        addrlist = addrdict["sn_responseContent"]["sn_body"]["getFullAddress"]["resultInfo"]
        province = []
        city = []
        district = []
        town = []
        for i in addrlist:
            i.pop('snId')
            if int(i["level"]) == 1:
                province.append(i)
            elif int(i["level"]) == 2:
                city.append(i)
            elif int(i["level"]) == 3:
                i["nid"] = i.pop("id")
            else:
                i["nid"] = i.pop("id")
    except Exception as e:
        r["error"] = 1
        r["errmsg"] = e
        return HttpResponse(r)

    else:
        r["error"] = 0
        r["errmsg"] = 'successful'
        r["province"] = province
        r["city"] = city
        r["district"] = district
        r["town"] = town
        return HttpResponse(json.dumps(r))










