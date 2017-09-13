#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from django.http import HttpResponse, JsonResponse
from dss.Serializer import serializer
from authx.models import *
from product.models import *
from i3jf.settings import *
import requests
import hashlib
import json
import datetime
import uuid
import time
ISFORMAT="%Y-%m-%d %H:%M:%S"
TIMESTAMP="%Y%m%d%H%M%S"

d = str(datetime.date.today())


def make_failed_msg(msg):
    r = dict()
    r['errno'] = 1
    r['errmsg'] = msg
    return json.dumps(r)


def make_success_msg(msg):
    r = dict()
    r['errno'] = 0
    r['errmsg'] = msg
    return json.dumps(r)

@login_required
def order_list(request):
    return render(request,"i3jf/full_order.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def order_confirm(request):
    return render(request,"i3jf/order.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def order_submit(request):
    return render(request,"i3jf/order_submit.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def order_pay(request):
    return render(request, "i3jf/pay.html", {"static_url": STATIC_URL + "i3jf/"})

@login_required
def order_detail(request):
    return render(request, "i3jf/order_detail.html", {"static_url": STATIC_URL + "i3jf/"})

@login_required
@require_http_methods(["GET"])
def get_ship_carriage(request):
    '''
    获取产品运费信息
    :param request:
    :return:
    '''
    data = request.GET
    cityId = data.get("cityId")
    districtId = data.get("districtId")
    townId = data.get("townId")
    addrDetail = data.get("addrDetail").encode("utf8")
    productList = json.loads(data.getlist('productList')[0])
    h = hashlib.md5()
    b = {"sign": ""}
    b['appKey'] = APPKEY
    b['accessToken'] = ACCESSTOKEN
    b['channel'] = CHANNELSN
    b['skuIds'] = productList
    b['cityId'] = str(cityId)
    b['districtId'] = str(districtId)
    b['townId'] = str(townId)
    b['addrDetail'] = str(addrDetail)

    j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
    h.update(j)
    signing = h.hexdigest()
    b["sign"] = signing
    b = json.dumps(b, sort_keys=True)
    z = URL + "shipCarriage?data=" + (b)
    x = requests.get(z)
    x = json.loads(x.content)
    resp = {}
    if "sn_error" in x.get("sn_responseContent"):
        return HttpResponse(make_failed_msg("Get freightFare Failed"))
    r = x.get("sn_responseContent").get("sn_body").get("getShipCarriage")
    resp["errno"] = 0
    resp["errmsg"] = "successful"
    resp["freightFare"] = x.get("freightFare")
    return HttpResponse(json.dumps(resp))


@login_required()
@require_http_methods(["POST"])
def order_create(request):
    '''
    创建订单
    :param request: 1、productList 产品数组 2、address_id 地址id
    :return: 1、num 产品数量 2、price 订单总价格 3、order_no 订单编号

    1、invoiceState：是否开发票 2、invoiceType：发票类型 3、invoiceContent：发票内容
    4、reviewId：是否需要审核
    '''
    data = request.POST
    sku = data.getlist("sku")[0]
    name = data.get("name").encode("utf8")
    mobile = data.get("mobile")
    provinceId = data.get("provinceId").encode("utf8")
    cityId = data.get("cityId").encode("utf8")
    countyId = data.get("countyId").encode("utf8")
    address = data.get("address").encode("utf8")
    amount = data.get("amount")
    freight = data.get("frieight")
    if data.get("companyName",None):
        companyName = data.get("companyName").encode("utf8")
        invoiceState = data.get("invoiceState", 0)
        invoiceContent = data.get("invoiceContent", 1).encode("utf8")
        invoiceType = data.get("invoiceType", 1).encode("utf8")
        invoice_num = data.get("invoice_num").encode("utf8")
    else:
        companyName = data.get("companyName")
        invoiceState = data.get("invoiceState", 0)
        invoiceContent = data.get("invoiceContent", 1)
        invoiceType = data.get("invoiceType", 1)
        invoice_num = data.get("invoice_num")
    payment = data.get("payment")
    remark = data.get("remark",'无').encode("utf8")
    sku = json.loads(sku)
    user = request.user.customer
    h = hashlib.md5()
    b = {"name": str(name), "provinceId": str(provinceId), "cityId": str(cityId), "countyId": str(countyId),
         "townId": "",
         "address": str(address), "phone": "025-88888888", "mobile": str(mobile),
         "email": "",
         "invoiceState": str(invoiceState), "invoiceType": str(invoiceType), "companyName": str(companyName),
         "invoiceContent": str(invoiceContent), "amount": str(amount), "freight": str(freight), "payment": '09',
         "remark": str(remark),
         "reviewId": "1", "sign": "", "invoice_num": str(invoice_num)}
    b["appKey"] = APPKEY
    b["accessToken"] = ACCESSTOKEN
    b["channel"] = CHANNELSN
    tradeNO = str(uuid.uuid1())
    b["tradeNO"] = tradeNO
    b['invoice_num'] = ""
    b["sku"] = sku  # [{"skuId":"121347700","num":"1","price":"56.00","dealing":"0.00","coupon":"0.00"}]
    j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
    h.update(j)
    signing = h.hexdigest()
    b['sign'] = signing
    b = json.dumps(b, sort_keys=True)
    z = URL + "createOrder?data=" + (b)
    r = requests.get(z)
    r = json.loads(r.content)
    print r
    try:
        resp = {}
        r = r.get("sn_responseContent").get("sn_body").get("addOrder")
        orderId = r.get("orderId")
        amount = r.get("amount")
        freight = r.get("freight")
        skus = r.get("skus")
        resp["errno"] = 0
        resp["errmsg"] = "successful"
        resp["orderId"] = orderId
        resp["amount"] = amount
        resp["num"] = len(skus)
        invoice_obj = InvoiceModel.objects.create(customer=user, company_name="")
        order = OrderModel.objects.create(customer=user,
                                          orderId=orderId,
                                          invoice=invoice_obj,
                                          amount=amount,
                                          freight=freight,
                                          payment=payment,
                                          address=address,
                                          name=name,
                                          telephone=mobile
                                          )
        for sku in skus:
            product_obj = ProductModel.objects.get(sku=sku.get("skuId"))
            CartModel.objects.filter(product=product_obj).delete()
            ProductMiniModel.objects.create(order=order, skuid=sku.get("skuId"),
                                            price=sku.get("price"),
                                            num=sku.get("num"),
                                            orderItemId=sku.get("orderItemId"),
                                            arriveData=sku.get("arriveData"))
    except Exception as e:
        error = r.get("sn_responseContent").get("sn_error").get("error_msg")
        return HttpResponse(make_failed_msg("create order failed"))
    else:
        return HttpResponse(json.dumps(resp))


@login_required
@require_http_methods(["POST"])
def reject_order(request):
    '''
    确认预占订单
    :param request:
    :return:
    '''
    data = request.POST
    orderId = data.get("orderId")
    products = []
    r = {"dealing": "", "coupon": ""}
    order_obj = OrderModel.objects.get(orderId=orderId)
    productminilist = order_obj.product_bought_list.all()
    for productmini_obj in productminilist:
        r["skuId"] = productmini_obj.skuid
        r["orderItemId"] = productmini_obj.orderItemId
        products.append(r)
    h = hashlib.md5()
    b = {"sign": ""}
    b['appKey'] = APPKEY
    b['channel'] = CHANNELSN
    b['accessToken'] = ACCESSTOKEN
    b['orderId'] = orderId
    b['products'] = products
    j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
    h.update(j)
    signing = h.hexdigest()
    b["sign"] = signing
    b = json.dumps(b, sort_keys=True)
    z = URL + "confirmOrder?data=" + (b)
    x = requests.get(z)
    x = json.loads(x.content)
    try:
        x = x.get("sn_responseContent").get("sn_body").get("addConfirmOrder").get("campSuccess")
        if x == "Y":
            order_obj = OrderModel.objects.get(orderId=orderId)
            order_obj.state = 2
            order_obj.save()
    except Exception as e:
        return HttpResponse(make_failed_msg("Reject Order"))
    return HttpResponse(make_success_msg("SUCCESSFUL"))


@login_required
@require_http_methods(["POST"])
def cancel_order(request):
    '''
    取消预占订单
    :param request:
    :return:
    '''
    data = request.POST
    orderId = data.get("orderId")
    h = hashlib.md5()
    b = {"sign": ""}
    b['appKey'] = APPKEY
    b['channel'] = CHANNELSN
    b['accessToken'] = ACCESSTOKEN
    b['orderId'] = orderId
    j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
    h.update(j)
    signing = h.hexdigest()
    b["sign"] = signing
    b = json.dumps(b, sort_keys=True)
    z = URL + "rejectOrder?data=" + (b)
    x = requests.get(z)
    x = json.loads(x.content)
    try:
        x = x.get("sn_responseContent").get("sn_body").get("deleteRejectOrder").get("unCampSuccess")
        if x == "Y":
            order_obj = OrderModel.objects.get(orderId=orderId)
            order_obj.state = 4
            order_obj.save()
    except Exception as e:
        return HttpResponse(make_failed_msg("Reject Order"))
    return HttpResponse(make_success_msg("SUCCESSFUL"))





@login_required
@require_http_methods(['GET'])
def check_score(request):
    '''
    检查积分是否足够
    :param request:
    :return:
    '''
    data = request.GET
    order_no = data.get('order_no')
    try:
        order_obj = OrderModel.objects.get(orderId=order_no)
    except ObjectDoesNotExist:
        return HttpResponse(make_failed_msg("No Such Order"))
    else:
        resp = {}
        resp["errno"] = 0
        resp["errmsg"] = "successful"
        resp["credit_needed"] = str(order_obj.amount)
        resp['credit_remaining'] = str(order_obj.customer.credit_remaining)
        resp["credit_need_recharge"] = str(order_obj.amount - order_obj.customer.credit_remaining)
        return HttpResponse(json.dumps(resp))


@login_required
@require_http_methods(['GET'])
def get_all_order_list(request):
    '''
    获取全部订单
    :param request:
    :return:
    '''
    data = request.GET
    page = data.get("page")
    rows = data.get("rows")
    resp = {}
    resp["errno"] = 0
    resp["errmsg"] = "successful"
    resp["amount"] = request.user.customer.buy_order_list.all().count()
    order_list = Paginator(request.user.customer.buy_order_list.all().order_by("-date_created"), int(rows))
    resp["list"] = serializer(order_list.page(page), output_type="row")
    # resp["list"].append('product_list')
    if resp['list']:
        for order_obj in resp["list"]:
            nid = order_obj.get("id")
            product = ProductMiniModel.objects.filter(order_id=nid)
            order_obj["product_list"] = serializer(product, output_type="row")
            for i in order_obj["product_list"]:
                sku = i.get("skuid")
                product_obj = ProductModel.objects.get(sku=sku)
                i['image'] = product_obj.image
                i["name"] = product_obj.name
    else:
        return HttpResponse(make_failed_msg("No Such Order"))

    return HttpResponse(json.dumps(resp))


@login_required
@require_http_methods(['GET'])
def get_all_order_unpay_list(request):
    '''
    获取未支付的订单
    :param request:
    :return:
    '''
    data = request.GET
    page = data.get("page")
    rows = data.get("rows")
    resp = {}
    resp["errno"] = 0
    resp["errmsg"] = "successful"
    resp["amount"] = request.user.customer.buy_order_list.filter(state=1).count()
    OrderModel.objects.filter()
    order_list = Paginator(request.user.customer.buy_order_list.filter(state=1).order_by("-date_created"), int(rows))
    resp["list"] = serializer(order_list.page(page), output_type="row")
    if resp['list']:
        for order_obj in resp["list"]:
            nid = order_obj.get("id")
            product = ProductMiniModel.objects.filter(order_id=nid)
            order_obj["product_list"] = serializer(product, output_type="row")
            for i in order_obj["product_list"]:
                sku = i.get("skuid")
                product_obj = ProductModel.objects.get(sku=sku)
                i['image'] = product_obj.image
                i["name"] = product_obj.name
    else:
        return HttpResponse(make_failed_msg("No Such Order"))

    return HttpResponse(json.dumps(resp))


@login_required
@require_http_methods(['GET'])
def get_all_order_unsend_list(request):
    '''
    获取未发货订单
    :param request:
    :return:
    '''
    data = request.GET
    page = data.get("page")
    rows = data.get("rows")
    resp = {}
    resp["errno"] = 0
    resp["errmsg"] = "successful"
    resp["amount"] = request.user.customer.buy_order_list.filter(state=2).count()
    order_list = Paginator(request.user.customer.buy_order_list.filter(state=2).order_by("-date_created"), int(rows))
    resp["list"] = serializer(order_list.page(page), output_type="row")
    if resp['list']:
        for order_obj in resp["list"]:
            nid = order_obj.get("id")
            product = ProductMiniModel.objects.filter(order_id=nid)
            order_obj["product_list"] = serializer(product, output_type="row")
            for i in order_obj["product_list"]:
                sku = i.get("skuid")
                product_obj = ProductModel.objects.get(sku=sku)
                i['image'] = product_obj.image
                i["name"] = product_obj.name
    else:
        return HttpResponse(make_failed_msg("No Such Order"))

    return HttpResponse(json.dumps(resp))


@login_required
@require_http_methods(['GET'])
def get_all_order_canceled_list(request):
    '''
    获取取消退货订单
    :param request:
    :return:
    '''
    data = request.GET
    page = data.get("page")
    rows = data.get("rows")
    resp = {}
    resp["errno"] = 0
    resp["errmsg"] = "successful"
    resp['amount'] = request.user.customer.buy_order_list.filter(state=4).count()
    order_list = Paginator(request.user.customer.buy_order_list.filter(state=4).order_by("-date_created"), int(rows))
    resp["list"] = serializer(order_list.page(page), output_type="row")
    if resp['list']:
        for order_obj in resp["list"]:
            nid = order_obj.get("id")
            product = ProductMiniModel.objects.filter(order_id=nid)
            order_obj["product_list"] = serializer(product, output_type="row")
            for i in order_obj["product_list"]:
                sku = i.get("skuid")
                product_obj = ProductModel.objects.get(sku=sku)
                i['image'] = product_obj.image
                i["name"] = product_obj.name
    else:
        return HttpResponse(make_failed_msg("No Such Order"))

    return HttpResponse(json.dumps(resp))


@login_required
@require_http_methods(["GET"])
def get_order_retrieve(request):
    '''
    获取订单详细信息
    :param request:
    :return:
    '''
    data = request.GET
    order_no = data.get("order_no")
    h = hashlib.md5()
    b = {"sign": ""}
    b['appKey'] = APPKEY
    b['channel'] = CHANNELSN
    b['accessToken'] = ACCESSTOKEN
    b['orderId'] = order_no
    j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
    h.update(j)
    signing = h.hexdigest()
    b["sign"] = signing
    b = json.dumps(b, sort_keys=True)
    z = URL + "orderDetail?data=" + (b)
    x = requests.get(z)
    x = json.loads(x.content)
    if "isSuccess" in x:
        return HttpResponse(make_failed_msg("Get Order Retrieve Falied"))
    else:
        order_obj = OrderModel.objects.filter(orderId=order_no)[0]
        resp = x.get("sn_responseContent").get("sn_body").get("getOrderDetail")
        resp["errno"] = 0
        resp["errmsg"] = "successful"
        resp["name"] = request.user.customer.nickname
        resp["freight"] = str(order_obj.freight)

        return HttpResponse(json.dumps(resp))


@login_required
@require_http_methods(["GET"])
def get_order_logistics(request):
    '''
    获取物流信息
    :param request:
    :return:
    '''
    data = request.GET
    order_no = data.get("order_no")
    skuId = data.get("skuId")
    orderItemId = data.get("orderItemId")
    h = hashlib.md5()
    b = {"sign": ""}
    b['appKey'] = APPKEY
    b['accessToken'] = ACCESSTOKEN
    b['channel'] = CHANNELSN
    b['skuId'] = skuId
    b['orderId'] =  order_no
    b['orderItemId'] = orderItemId
    j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
    h.update(j)
    signing = h.hexdigest()
    b["sign"] = signing
    b = json.dumps(b, sort_keys=True)
    z = URL + "orderLogist?data=" + (b)
    x = requests.get(z)
    x = json.loads(x.content)
    if "isSuccess" not in x:
        r = {}
        orderLogisticStatus = []
        r["errno"] = 0
        x = x.get("sn_responseContent").get("sn_body").get("getOrderLogist")
        r['orderId'] = x.get("orderId")
        r["skuId"] = x.get("skuId")
        r["orderItemId"] = x.get("orderItemId")
        for i in x.get("orderLogisticStatus"):
            if i:
                i["operateTime"] = str(time.strftime(ISFORMAT, time.strptime(i.get("operateTime"), TIMESTAMP)))
                orderLogisticStatus.append(i)
        r["orderLogisticStatus"] = orderLogisticStatus
        return HttpResponse(json.dumps(r))
    else:
        return HttpResponse(make_failed_msg("Order Not Found"))


@login_required
@require_http_methods(["POST"])
def refund_order(request):
    '''
    取消订单
    :param request:
    :return:
    '''
    data = request.POST
    order_no = data.get("order_no")
    try:
        order_obj = OrderModel.objects.get(orderId=order_no)
    except ObjectDoesNotExist:
        return HttpResponse(make_failed_msg("No Such Order"))
    else:
        sku_list = []
        sku_dict = {}
        productmin_list = order_obj.product_bought_list.all()
        for productmin_obj in productmin_list:
            sku_dict["skuId"] = productmin_obj.skuid
            sku_list.append(sku_dict)
        h = hashlib.md5()
        b = {"sign": ""}
        b['appKey'] = APPKEY
        b['channel'] = CHANNELSN
        b['accessToken'] = ACCESSTOKEN
        b['orderId'] = order_no
        b['skus'] = sku_list
        j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
        h.update(j)
        signing = h.hexdigest()
        b["sign"] = signing
        b = json.dumps(b, sort_keys=True)
        z = URL + "cancelOrder?data=" + (b)
        x = requests.get(z)
        x = json.loads(x.content)
        try:
            order_info = x.get("sn_responseContent").get("sn_body").get("addApplyRejected")
            orderId = order_info.get("orderId")
            info_list = order_info.get("infoList")
        except Exception as e:
            error_msg = x.get("sn_responseContent").get("sn_error").get("error_msg")
            return HttpResponse(make_failed_msg("canneled failed"))
        else:
            order_obj = OrderModel.objects.get(orderId=orderId)
            order_obj.state = 4
            order_obj.save()
        return HttpResponse(make_success_msg("successful"))

# @login_required
# @require_http_methods(["GET"])
# def refund_order(request):
#     '''
#     取消订单
#     :param request:
#     :return:
#     '''
#     # data = request.POST
#     # order_no = data.get("order_no")
#     # try:
#     #     order_obj = OrderModel.objects.get(orderId=order_no)
#     # except ObjectDoesNotExist:
#     #     return HttpResponse(make_failed_msg("No Such Order"))
#     # else:
#     #     sku_list = []
#     #     sku_dict = {}
#     #     productmin_list = order_obj.product_bought_list.all()
#     #     for productmin_obj in productmin_list:
#     #         sku_dict["skuId"] = productmin_obj.skuid
#     #         sku_list.append(sku_dict)
#     h = hashlib.md5()
#     b = {"sign": ""}
#     b['appKey'] = APPKEY
#     b['channel'] = CHANNELSN
#     b['accessToken'] = ACCESSTOKEN
#     b['orderId'] = "65cb3740-8318-11e7-9437-4ccc6a46b6ed"
#     b['skus'] = [{"skuId":"122438930"}]
#     j = ACCESSTOKEN + json.dumps(b, sort_keys=True,separators=(',', ':')) + APPKEY + d
#     h.update(j)
#     signing = h.hexdigest()
#     b["sign"] = signing
#     b = json.dumps(b, sort_keys=True)
#     z = URL + "cancelOrder?data=" + (b)
#     print z
#     x = requests.get(z)
#     print x.content
#     x = json.loads(x.content)
#     # try:
#     #     order_info = x.get("sn_responseContent").get("sn_body").get("addApplyRejected")
#     #     orderId = order_info.get("orderId")
#     #     info_list = order_info.get("infoList")
#     # except Exception as e:
#     #     error_msg = x.get("sn_responseContent").get("sn_error").get("error_msg")
#     #     return HttpResponse(make_failed_msg("canneled failed"))
#     # else:
#     #     order_obj = OrderModel.objects.get(orderId=orderId)
#     #     order_obj.state = 4
#     #     order_obj.save()
#     return HttpResponse(make_success_msg("successful"))

@login_required
@require_http_methods(["POST"])
def remove_order(request):
    '''
    删除订单
    :param request:
    :return:
    '''
    data = request.POST
    order_no = data.get("order_no")

    try:
        order_obj = OrderModel.objects.get(id=order_no)
    except ObjectDoesNotExist:
        return HttpResponse(make_failed_msg("remove Failed"))
    else:
        order_obj.invoice.delete()
        order_obj.delete()
        return HttpResponse(make_success_msg("successful"))
