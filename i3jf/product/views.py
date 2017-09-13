#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from .models import *
from area.models import *
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from dss.Serializer import serializer
import json
from django.db.models import Q
from django.core.paginator import Paginator
from utils.misc import *
from i3jf.settings import API_PARAM,ACCESSTOKEN,CHANNELSN,APPKEY,URL,STATIC_URL
import requests

def make_success_msg():
    r = dict()
    r['errno'] = 0
    return json.dumps(r)

def getIp(request):
    # ip = request.META.get("REMOTE_ADDR")
    ip = "202.106.0.20"
    url = "http://ip.taobao.com/service/getIpInfo.php?ip=%s" % ip
    u = requests.get(url)
    data = json.loads(u.content).get("data")
    province = data.get("region").encode("utf8")
    city = data.get("city")
    print province,city
    r = {}
    r["errno"] = 0
    r["province_id"] = ProvinceModel.objects.get(name="北京").nid
    r["city_id"] = CityModel.objects.get(name=city).nid
    return HttpResponse(json.dumps(r))


def product_detail(request):
    return render(request,'i3jf/detail_page.html',{"static_url":STATIC_URL+"i3jf/"})

def search_product(request):
    return render(request, 'i3jf/class_detail.html', {"static_url": STATIC_URL + "i3jf/"})

@require_http_methods(["GET"])
def get_product_detail_view(request):
    '''
    获取产品详情
    :param request:
    :return:
    '''
    data = request.GET
    resp = HttpResponse()
    sku = data.get("sku")
    try:
        product = ProductModel.objects.get( sku = sku )
    except ObjectDoesNotExist:
        resp.write( make_failed_msg('No Such Product') )
    else:

        r={}
        params = eval(product.param.encode("utf8"))
        r["param"] = params
        r['errno'] = 0
        r['product'] = serializer(product, output_type='raw')
        resp.write(json.dumps(r))
    return resp


# @require_http_methods(["GET"])
# def get_product_stock_view(request):
#     '''
#     获取单个产品库存
#     :param request:
#     :return:
#     '''
#     data = request.GET
#     city_id = data.get("city_id")
#     county_id = data.get("county_id")
#     r = HttpResponse()
#     try:
#         product = ProductModel.objects.get( sku = data['sku'] )
#     except ObjectDoesNotExist:
#         r.write( make_failed_msg( 'No Such Product'))
#     else:
#         if product.source == 0:
#             source = 'sn'
#         elif product.source == 1:
#             source = 'jd'
#         else:
#             source = 'self'
#         if not source == 'self':
#             x = requests.get(
#                 '{}getProductInventory?data={{"accessToken":"{}","appKey":"{}","channel":"{}", "skuId":"{}", "num":"1","cityId":"{}","countryId":"{}"}}'.format(
#                     URL, ACCESSTOKEN, APPKEY, CHANNELSN,  data['sku'],city_id,county_id))
#             results = json.loads(x.content)
#             try :
#                 results = results["sn_responseContent"]["sn_body"]["getInventory"]["resultInfo"][0]
#                 respDict = {}
#                 respDict['errno'] = 0
#                 respDict['sku'] = results['skuId']
#                 respDict['state'] = results['state']
#                 r.write(json.dumps(respDict))
#             except Exception as e:
#                 r.write(make_failed_msg("get faild"))
#         else:
#             respDict = {}
#             respDict['errno'] = 0
#             respDict['sku'] = product.sku
#             if product.stock == -1:
#                 respDict['state'] = '01'
#             elif product.stock == -2:
#                 respDict['state'] = '02'
#             elif product.stock >= data['num']:
#                 respDict['state'] = '00'
#             else:
#                 respDict['state'] = '03'
#             r.write(json.dumps(respDict))
#     return r
@require_http_methods(["GET"])
def get_product_stock_view(request):
    '''
    批量获取产品库存
    :param request:
    :return:
    '''
    data = request.GET
    sku = data.getlist("sku[]")[0]
    city_id = data.get("city_id")
    try:
        ProductModel.objects.get(sku=sku)
    except ObjectDoesNotExist:
        return HttpResponse(make_failed_msg("No Such Product"))
    else:

        state_dict = {"productInventory": []}
        skuIds = [{'skuId': sku}]
        skuIds = json.dumps(skuIds)
        reg = '{}batchQueryInventoryStatus?data={{"accessToken":"{}","appKey":"{}","channel":"{}", "skuIds":{}, "cityId":"025"}}'.format(
            URL, ACCESSTOKEN, APPKEY, CHANNELSN, skuIds)
        x = requests.get(reg)
        x = json.loads(x.content)
        content = x.get('sn_responseContent')
        if 'sn_error' not in content:
            states = x.get("sn_responseContent").get("sn_body").get("queryMpStock").get("resultInfo")
            for i in states:
                r = {}
                pobj = ProductModel.objects.get(sku=i.get("skuId"))
                pobj.state = i.get("state")
                r["errno"] = 0
                r["state"] = i.get("state")
                r["sku"] = i.get("skuId")
    return HttpResponse(json.dumps(r))



@require_http_methods(["GET"])
def batch_get_product_stock_view(request):
    '''
    批量获取产品库存
    :param request:
    :return:
    '''
    data = request.GET
    resp = HttpResponse()
    skus = data.getlist("sku[]")
    city_id = data.get("city_id")
    state_dict = {"productInventory": []}
    skulist = []
    for sku in skus:
        mydict = {}
        mydict['skuId'] = sku
        skulist.append(mydict)
    skuIds = json.dumps(skulist)
    try:
        product = ProductModel.objects.get(sku=sku)
    except ObjectDoesNotExist:
        resp.write(make_failed_msg('No Such Product'))
    else:
        if product.source == 0:
            source = 'sn'
        elif product.source == 1:
            source = 'jd'
        else:
            source = 'self'
        if not source == 'self':
            reg = '{}batchQueryInventoryStatus?data={{"accessToken":"{}","appKey":"{}","channel":"{}", "skuIds":{}, "cityId":"{}"}}'.format(
                URL, ACCESSTOKEN, APPKEY, CHANNELSN, skuIds,city_id)
            x = requests.get(reg)
            x = requests.get(reg)
            x = json.loads(x.content)
            try:
                x = x["sn_responseContent"]["sn_body"]["queryMpStock"]["resultInfo"]
                for i in x:
                    r = {}
                    r["sku"] = i.get("skuId")
                    r["state"] = i.get("state")
                    state_dict["errno"] = 0
                    state_dict["errmsg"] = "success"
                    state_dict["productInventory"].append(r)
            except Exception as e:
                resp.write(make_failed_msg("get faild"))

        else:
            r = {}
            r['sku'] = product.sku
            if product.stock == -1:
                r['state'] = '01'
            elif product.stock == -2:
                r['state'] = '02'
            elif product.stock >= data['num']:
                r['state'] = '00'
            else:
                r['state'] = '03'
            state_dict["errno"] = 0
            state_dict["errmsg"] = "success"
            state_dict["productInventory"].append(r)
    resp.write(json.dumps(state_dict))
    return resp

@require_http_methods(["GET"])
def get_product_image_view(request):
    '''
    获取产品图片
    :param request:
    :return:
    '''
    data = request.GET
    resp = HttpResponse()
    sku = data.get("sku")
    try:
        product = ProductModel.objects.get( sku = sku )
    except ObjectDoesNotExist:
        resp.write( make_failed_msg('No Such Product') )
    else:
        r={}
        r['errno'] = 0
        r['sku'] = sku
        r['urls'] = serializer(product.image_list.all(), output_type='raw')
        resp.write(json.dumps(r))
    return resp


@require_http_methods(["GET"])
def search_product_view(request):
    '''
    搜索产品
    :param request:
    :return:
    '''
    data = request.GET
    page = data.get("page")
    resp = HttpResponse()
    order = data['order']
    rows = data.get("rows")
    keyword = data.get("keyword").encode("utf8")
    if data.get("categroyId2"):
        resp = {}
        resp["amount"] = ProductModel.objects.filter(Q(name__icontains=keyword) & Q(category_d2=data.get("categroyId2"))).count()
        product_list = Paginator(
            ProductModel.objects.filter(Q(name__icontains=keyword) & Q(category_d2=data.get("categroyId2"))).
            values("name", "image", "credit_amount", "sku").
            order_by('-credit_amount' if order == 'asc' else 'credit_amount'), int(rows))
        resp['errno'] = 0
        resp['list'] = serializer(product_list.page(int(page)), output_type='raw')
    else:
        resp = {}
        resp["amount"] = ProductModel.objects.filter(name__icontains =keyword).count()
        product_list = Paginator(ProductModel.objects.filter(name__icontains =keyword).
                                 values("name","image","credit_amount","sku").
                                 order_by('-credit_amount' if order == 'asc' else 'credit_amount'), int(rows))
        resp['errno'] = 0
        resp['list'] = serializer(product_list.page(int(page)), output_type='raw')
    return HttpResponse(json.dumps(resp))


@require_http_methods(["GET"])
def get_credit_view(request):
    '''
    获取产品价格
    :param request:
    :return:
    '''
    data = request.GET
    resp = HttpResponse()
    skuId = data.get("sku")
    city_id = data.get("city_id")
    r = {}
    mydict = {}
    sku = []
    mydict['skuId'] = data.get('sku')
    sku.append(mydict)
    try:
        product = ProductModel.objects.get(sku=skuId)
    except ObjectDoesNotExist:
        resp.write(make_failed_msg('No Such Product'))
    else:
        if product.source == 0:
            source = 'sn'
        elif product.source == 1:
            source = 'jd'
        else:
            source = 'self'
        if not source == 'self':
            reg = '{}getProductPrice?data={{"accessToken":"{}","appKey":"{}","channel":"{}","cityId":"025","skus":{}}}'.format(
                URL, ACCESSTOKEN, APPKEY, CHANNELSN, json.dumps(sku))
            x = requests.get(reg)
            x = json.loads(x.content)
            x = x["sn_responseContent"]["sn_body"]["queryPrice"]["skus"][0]
            r["amount"] = x.get("price")
            r["sku"] = x.get("skuId")
            sku = x.get("skuId")
            amount = x.get("price")
            product_obj =  ProductModel.objects.get(sku=sku)
            product_obj.credit_amount = amount
            product_obj.save()
            r['errno'] = 0
            resp.write(json.dumps(r))
        else:
            r['errno'] = 0
            r['sku'] = sku
            r['amount'] = serializer(product.credit_amount, output_type='raw')
            resp.write(json.dumps(r))

    return resp


@require_http_methods(["GET"])
def batch_query_price_view(request):
    '''
    批量获取产品价格
    :param request:
    :return:
    '''
    data = request.GET
    resp = HttpResponse()
    skuIds = data.getlist("skus")
    city_id = data.get("city_id")
    price_dict = {"price_list":[]}
    mydict = {}
    skulist = []
    for sku in eval(skuIds[0].encode("utf8")):
        mydict['skuId'] = sku
        skulist.append(mydict)
        try:
            product = ProductModel.objects.get(sku=sku)
        except ObjectDoesNotExist:
            resp.write(make_failed_msg('No Such Product'))
        else:
            if product.source == 0:
                source = 'sn'
            elif product.source == 1:
                source = 'jd'
            else:
                source = 'self'
            if not source == 'self':
                reg = '{}getProductPrice?data={{"accessToken":"{}","appKey":"{}","channel":"{}","cityId":"025","skus":{}}}'.format(
                    URL, ACCESSTOKEN, APPKEY, CHANNELSN, json.dumps(skulist))
                x = requests.get(reg)
                x = json.loads(x.content)
                x = x["sn_responseContent"]["sn_body"]["queryPrice"]["skus"][0]
                r = {}
                r["amount"] = x.get("price")
                r["sku"] = x.get("skuId")
                price_dict["errno"] = 0
                price_dict["errmsg"] = "success"
                price_dict.get("price_list").append(r)

            else:
                r['sku'] = product.sku
                r['amount'] = serializer(product.credit_amount, output_type='raw')
                price_dict["errno"] = 0
                price_dict["errmsg"] = "success"
                price_dict.get("price_list").append(r)
    resp.write(json.dumps(price_dict))
    return resp

@require_http_methods(["GET"])
def get_all_product_view(request):
    '''
    获取全部产品信息
    :param request:
    :return:
    '''
    resp = {}
    data = request.GET
    rows = data.get("rows")
    page = data.get("page")
    order = data.get("order")
    resp["amount"] = ProductModel.objects.all().count()
    product_list = Paginator(ProductModel.objects.all().values("name","image","credit_amount","sku").
                             order_by('-credit_amount' if order == 'asc' else 'credit_amount'),int(rows))
    resp['list'] = serializer(product_list.page(int(page)),output_type='raw')
    resp['errno'] = 0
    return HttpResponse(json.dumps(resp))

@require_http_methods(["GET"])
def get_categroy1_product_view(request):
    '''
    一级分类所有的商品
    :param request:
    :return:
    '''
    resp = {}
    data = request.GET
    rows = data.get("rows")
    page = data.get("page")
    order = data.get("order")
    categroyId = data.get("categroyId")
    resp["amount"] =ProductModel.objects.filter(category_d1_id=categroyId).count()
    product_list = Paginator(
        ProductModel.objects.filter(category_d1_id=categroyId).values("name", "image", "credit_amount", "sku").order_by(
            '-credit_amount' if order == 'asc' else 'credit_amount'), int(rows))
    resp['errno'] = 0
    resp['list'] = serializer(product_list.page(int(page)), output_type='raw')
    return HttpResponse(json.dumps(resp))

@require_http_methods(["GET"])
def get_categroy2_product_view(request):
    '''
    一级和二级分类所有的商品
    :param request:
    :return:
    '''
    resp = {}

    data = request.GET
    rows = data.get("rows")
    page = data.get("page")
    order = data.get("order")
    categroyId1 = data.get("categroyId1")
    categroyId2 = data.get("categroyId2")
    resp["amount"] =ProductModel.objects.filter(Q(category_d1_id=categroyId1)&Q(category_d2=categroyId2)).count()
    product_list =  Paginator(ProductModel.objects.filter(Q(category_d1_id=categroyId1)&Q(category_d2=categroyId2)).
        values("name", "image", "credit_amount", "sku").order_by(
        '-credit_amount' if order == 'asc' else 'credit_amount'), int(rows))
    resp['errno'] = 0
    resp['list'] = serializer(product_list.page(int(page)), output_type='raw')
    return HttpResponse(json.dumps(resp))

@require_http_methods(["GET"])
def get_getcategory_detail(request):
    '''
    获取产品的详细分类信息
    :param request:
    :return:
    '''
    resp = {}
    data = request.GET
    sku = data.get("sku")
    try:
        probj = ProductModel.objects.get(sku=sku)
    except ObjectDoesNotExist:
        HttpResponse(json.dumps(make_failed_msg("No Such Product")))
    else:
        resp['errno'] = 0
        resp["name"] = probj.name
        resp["frist"] = serializer(probj.category_d1,output_type="raw")
        resp["second"] = serializer(probj.category_d2,output_type="raw")
    return HttpResponse(json.dumps(resp))




