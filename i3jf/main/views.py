#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.shortcuts import render
from product.models import *
from dss.Serializer import serializer
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpRequest
import json
from .models import *


@require_http_methods(['GET'])
def list_category_view(request):
    '''
    获取分类列表
    :param request:
    :return:
    '''
    one = Category1Model.objects.all()
    mylist = []
    for value in one:
        firstid = value.id
        firstName = value.name
        mydict = {}
        mydict["name"] = value.name
        mydict["id"] = firstid
        mylist.append(mydict)
        second = Category2Model.objects.filter(parent_id=firstid)
        Twolist = []
        for value in second:
            Tdict = {}
            secondid = value.id
            secondName = value.name
            Tdict['name'] = secondName
            Tdict['id'] = secondid
            Twolist.append(Tdict)
            mydict["categroy1"] = Twolist
            third = Category3Model.objects.filter(parent_id=secondid)
            Thirlist = []
            for value in third:
                Thirdict = {}
                Thirdict['name'] = value.name
                Thirdict['id'] = value.id
                Thirlist.append(Thirdict)
                Tdict["categroy2"] = Thirlist
    return HttpResponse(json.dumps(mylist))

@require_http_methods(['GET'])
def circle_view(request):
    r = {}
    r['errno'] = 0
    mains = list(HomePageCircleModel.objects.filter(is_default=True))
    r['list'] = serializer(
        [(lambda m: {'pic_url': m.image,"priority":m.priority, 'redirect_type': m.redirect_type, 'content': m.content,"is_default":m.is_default})(m) for m in mains],
        output_type='raw')
    return HttpResponse( json.dumps( r) )

@require_http_methods(['GET'])
def list_channel_view(request):
    '''
    获取产品频道列表
    :param request:
    :return:
    '''
    ChannelModel.objects.all()
    r = {}
    r['errno'] = 0
    channels = list(ChannelModel.objects.filter(is_default=True))
    r['list'] = serializer([(lambda m: {'name': m.name,
                                        'priority': m.priority,
                                        'id': m.id,
                                        'image':m.image,
                                        'product_info':
                                            [(lambda p: {'image': p.image,
                                                         'sku': p.sku,
                                                         'name': p.name,
                                                         'price': p.credit_amount,
                                                         "is_hot":p.is_hot,
                                                         "is_big":p.is_big,
                                                         "id":p.id
                                                         })(p) for p in m.product.all()[0:9]]})(
        m) for m in channels], output_type='raw')
    return HttpResponse(json.dumps(r))

@require_http_methods(['GET'])
def recommendation_view(request):
    '''
    获取精品推荐商品
    :param request:
    :return:
    '''
    try:
        channel_obj = ChannelModel.objects.get(name="精品推荐")
    except ObjectDoesNotExist:
        return HttpResponse(make_failed_msg("get fail"))
    else:
        r = {}
        r['errno'] = 0
        r['list'] = serializer(
            [(lambda m: {'image': m.image, "name": m.name, 'sku': m.sku,
                         'price': m.credit_amount})(m) for m in channel_obj.product.all()[0:9]],
            output_type='raw')
    return HttpResponse(json.dumps(r))

@require_http_methods(['GET'])
def list_hotsale_view(request):
    '''
    频道热销产品
    :param request:
    :return:
    '''
    data = request.GET
    r = {}
    channel_id = data.get("channel_id",None)
    if channel_id:
        l = ProductModel.objects.filter(channels_belong_to__id=channel_id).filter( is_hot= True)[:6]
        r['errno'] = 0
        r["list"] = serializer(
            [(lambda m: {'image': m.image, 'sku': m.sku, 'amount': m.credit_amount, 'name': m.name})(m) for m in l],
            output_type='raw')
    else:
        l = ProductModel.objects.filter(channels_belong_to__id=1).filter(is_hot=True)
        r['errno'] = 0
        r["list"] = serializer(
            [(lambda m: {'image': m.image, 'sku': m.sku, 'amount': m.credit_amount, 'name': m.name})(m) for m in l],
            output_type='raw')
    return HttpResponse(json.dumps(r))

