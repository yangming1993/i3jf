# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from __future__ import division
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from dss.Serializer import serializer
from django.db.models import Q,F
from collections import Counter
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from django.core.exceptions import PermissionDenied
from i3jf.settings import STATIC_URL,MEDIA_ROOT,ACCESSTOKEN,CHANNELSN,APPKEY,URL, CAPTCHA_URL, CAPTCHA_DIR
from authx.miscs import *
from authx.models import *
from product.models import *
from main.models import *
from area.models import *
import datetime
import requests
import json
import uuid
import os
from django.contrib.admin.views.decorators import staff_member_required

def make_failed_msg(msg):
    r = dict()
    r['errno'] = 1
    r['errmsg'] = msg
    return json.dumps(r)

def make_success_msg():
    r = dict()
    r['errno'] = 0
    return json.dumps(r)

@staff_member_required
@login_required
def data_analysis(request):
    return render(request,"i3jf/admin/data.html",{"static_url": STATIC_URL + "i3jf/"})

def login(request):
    return render(request, "i3jf/admin/login.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def userList(request):
    return render(request, "i3jf/admin/user.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def orderList(request):
    return render(request, "i3jf/admin/order.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def orderDetail(request):
    return render(request, "i3jf/admin/orderDetail.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def history(request):
    return render(request, "i3jf/admin/back.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def priceSet(request):
    return render(request, "i3jf/admin/money.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def productLists(request):
    return render(request, "i3jf/admin/goods.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def backendLoop(request):
    return render(request, "i3jf/admin/loop.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def channelProductList(request):
    return render(request, "i3jf/admin/pindao.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def getPorductDetail(request):
    return render(request, "i3jf/admin/products.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def getAreaDetail(request):
    return render(request, "i3jf/admin/map.html", {"static_url": STATIC_URL + "i3jf/"})

@staff_member_required
@login_required
def channelDetal(request):
    return render(request, "i3jf/admin/watch.html", {"static_url": STATIC_URL + "i3jf/"})

@require_http_methods(["GET"])
def get_captcha_backend(request):
    '''
    获取验证码
    :param request:
    :return:
    '''
    csn = gCaptchaGenerator.Generate()
    name = str(uuid.uuid1())
    local_img = os.path.join( CAPTCHA_DIR, name )
    csn[0].save( local_img, "PNG")
    request.session['captcha'] = csn[1]
    cimageurl = CAPTCHA_URL + name
    result = json.dumps( { 'errno': 0, 'captcha_url':cimageurl , 'errmsg' :"" } )
    return HttpResponse(result, content_type="application/json")


@require_http_methods(["POST"])
def login_backend(request):
    '''
    用户登录
    :param request:
    :return:
    '''
    resp = HttpResponse()
    data = request.POST
    username = data.get("mobile")
    captcha = request.session['captcha'].lower() == data['captcha'].lower()
    if not captcha:
        return HttpResponse(make_failed_msg("请输入正确的验证码"))
    user = auth.authenticate( username = username, password = data['password'])
    if user:
        if user.is_staff:
            auth.login(request, user)
            resp.write(make_success_msg())
        else:
            raise PermissionDenied
    else:
        resp.write( make_failed_msg("用户名活密码不正确"))
    return resp

@login_required
@require_http_methods(["POST"])
def password_change_view(request):
    '''
    修改登录密码
    :param request:
    :return:
    '''
    resp = HttpResponse()
    data = request.POST
    user = request.user
    user_new = auth.authenticate(username=user.username, password= data['old_password'] )
    if user_new is None:
        resp.write(make_failed_msg('Mismatch PW'))
    elif user.is_active:
        user.set_password(data['new_password'])
        user.save()
        auth.login(request, user_new)
        resp.write(make_success_msg())
    else:
        resp.write(make_failed_msg('Unknown Error'))
    return resp

@login_required
@require_http_methods(["POST"])
def logout_backend(request):
    '''
    退出登录
    :param request:
    :return:
    '''
    auth.logout(request)
    resp = HttpResponse()
    resp.write(make_success_msg())
    return resp

@login_required
@require_http_methods(["GET"])
def user_list(request):
    '''
    用户列表
    :param request:
    :return:
    '''
    resp = HttpResponse()
    r = {}
    data = request.GET
    page = data.get("page")
    rows = data.get("rows")
    r['errno'] = 0
    r["amount"] = CustomerModel.objects.all().count()
    customerlist = Paginator(CustomerModel.objects.all().values("phone","nickname", "gender", "credit_remaining", "email","state","id")
                             .order_by("-date_created"),int(rows))
    r["userlist"] = serializer(customerlist.page(page),output_type="raw")
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["POST"])
def disable_enable_user(request):
    '''
    禁止和启用用户
    :param request:
    :return:
    '''
    resp = HttpResponse()
    data = request.POST
    state = data.get("State").capitalize()
    id = data.get("Id")
    if state:
        CustomerModel.objects.filter(id=id).update(state=state)
        resp.write(make_success_msg())
    else:
        CustomerModel.objects.get(id=id).update(state=state)
        resp.write(make_success_msg())
    return resp
@login_required
@require_http_methods(["POST"])
def recharge(request):
    '''
    充值积分
    :param request:
    :return:
    '''
    resp = HttpResponse()
    data = request.POST
    amount = data.get("Amount")
    customer = data.get("Id")
    CustomerModel.objects.filter(id=customer).update(credit_remaining=F("credit_remaining") + amount)
    resp.write(make_success_msg())
    return resp

@login_required
@require_http_methods(["GET"])
def order_all(request):
    '''
    订单列表
    :param request:
    :return:
    '''
    r = {}
    resp = HttpResponse()
    r['errno'] = 0
    r["amount"] = OrderModel.objects.all().count()
    orderlist = OrderModel.objects.all().values("customer__phone","customer__realname", "orderId", "amount", "freight", "payment", "state", "date_created",
                                        "name","telephone","address",'id').order_by("-date_created")

    r['orderlist'] = serializer(orderlist, output_type='raw')
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_order_state(request):
    '''
    状态订单列表
    :param request:
    :return:
    '''
    r = {}
    resp = HttpResponse()
    data = request.GET
    state = data.get("state")
    r['errno'] = 0
    r["amount"] = OrderModel.objects.filter(state=state,date_created__range=["2017-08-22", "2017-08-23"]).count()
    time = data.get("time")
    if time:
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        orderlist = OrderModel.objects.filter(state=state,date_created__range=[start_time, end_time]).values("customer__phone","customer__realname", "orderId", "amount", "freight", "payment", "state", "date_created",
                                        "name","telephone","address",'id').order_by(
                "-date_created")
        r['orderlist'] = serializer(orderlist, output_type='raw')
        resp.write(json.dumps(r))
    else:
        orderlist = OrderModel.objects.filter(state=state).values("customer__phone","customer__realname", "orderId", "amount", "freight", "payment", "state", "date_created",
                                        "name","telephone","address",'id').order_by("-date_created")
        r['orderlist'] = serializer(orderlist, output_type='raw')
        resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_order_cancel(request):
    '''
    退货历史
    :param request:
    :return:
    '''
    r = {}
    resp = HttpResponse()
    data = request.GET
    page = data.get("page")
    rows = data.get("rows")
    r['errno'] = 0
    r["amount"] = OrderModel.objects.filter(state=4).count()
    orderlist = OrderModel.objects.filter(state=4).values("customer__phone","customer__realname", "orderId", "amount", "freight", "payment", "state",
                                        "date_created","id",
                                        "name", "telephone", "address").order_by("-date_created")
    r['orderlist'] = serializer(orderlist, output_type='raw')
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_order_details(request):
    '''
    获取订单详细信息
    :param request:
    :return:
    '''
    data = request.GET
    r = {}
    resp = HttpResponse()
    orderId = data.get("id")
    order_obj = OrderModel.objects.get(id=orderId)
    r['errno'] = 0
    r["receiverAddress"] = order_obj.address
    r["receiverTel"] = order_obj.telephone
    r["orderAmt"] = str(order_obj.amount)
    r["receiverName"] = order_obj.name
    r["payment"] = order_obj.payment
    r["freight"] = str(order_obj.freight)
    r["orderItemList"] = []
    productminlist = ProductMiniModel.objects.filter(order_id=orderId)
    for productmin_obj in productminlist:
        s = {}
        s["num"] = productmin_obj.num
        skuId = productmin_obj.skuid
        productlist = ProductModel.objects.filter(sku=skuId)
        for i in productlist:
            s["name"] = i.name
            s["price"] = str(i.credit_amount)
        r["orderItemList"].append(s)
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_product_category(request):
    '''
    获取本地分类信息
    :param request:
    :return:
    '''
    x = requests.get('{}getProductCategory?data={{"appKey":"{}","accessToken":"{}","channel":"{}"}}'.format(URL, APPKEY, ACCESSTOKEN,
                                                                                       "i3jf"))
    resp = json.loads(x.content)
    if Category1Model.objects.filter().first():
        return HttpResponse(make_failed_msg("Porduct_info have already existed"))
    else:
        for first in resp:
            firstid = first.get("id")
            name = first.get("name")
            categroy1 = Category1Model.objects.create(first=firstid,name=name)
            for second in first.get("category1"):
                secondid = second.get("id")
                name = second.get("name")
                categroy2 = Category2Model.objects.create(second=secondid,name=name,parent=categroy1)
                for third in second.get("category2"):
                    thirdid = third.get("id")
                    name = third.get("name")
                    categroy3 = Category3Model.objects.create(third=thirdid,name=name,parent=categroy2)
        return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def get_getcategory_info(request):
    '''
    获取产品分类和本地数据对比,把sku和分类存到数据库
    :param request:
    :return:
    '''
    x = requests.get(
        '{}i3jfProductPool?data={{"appKey":"{}","accessToken":"{}","channel":"{}"}}'.format(URL, APPKEY, ACCESSTOKEN,
                                                                                       CHANNELSN))
    x = json.loads(x.content)

    for i in x:
        sku = i.get("skuId")
        if ProductModel.objects.filter(sku=sku).exists():
            pass
        else:
            category_d1 = i.get("category_d1",None)
            category_d2 = i.get("category_d2", None)
            if category_d1 and category_d2:
                frist_obj = Category1Model.objects.get(first=category_d1)
                second_obj = Category2Model.objects.get(second=category_d2)
                ProductModel.objects.update_or_create(sku=sku,category_d1=frist_obj,category_d2=second_obj)
            else:
                pass
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def get_product_info(request):
    '''
    获取 产品详细信息
    :param request:
    :return:
    '''
    for pobj in ProductModel.objects.all():
        response = requests.get(
            '{}getProductDetail?data={{"accessToken":"{}","appKey":"{}","channel":"{}", "skuId":"{}" }}'.format(
                URL, ACCESSTOKEN, APPKEY, CHANNELSN, pobj.sku))
        print response.content
        if pobj.name:
            pass
        else:
            response = requests.get(
                '{}getProductDetail?data={{"accessToken":"{}","appKey":"{}","channel":"{}", "skuId":"{}" }}'.format(
                    URL, ACCESSTOKEN, APPKEY, CHANNELSN, pobj.sku))
            try:
                response = json.loads(response.content)
            except Exception as e:
                pass
            else:
                content = response.get("sn_responseContent")
                if response.get("isSuccess") not in response and "sn_error" not in content:
                    response = response["sn_responseContent"]["sn_body"]["getProdDetail"]
                    r = {}
                    sku = []
                    sku.append(response.get("skuId"))
                    r["sku"] = response.get("skuId")
                    r["weight"] = response.get("weight")
                    r["image"] = response.get("image")
                    r["state"] = response.get("state")
                    r["brand"] = response.get("brand")
                    r["model"] = response.get("model")
                    r["name"] = response.get("name")
                    r["manufacture_place"] = response.get("productArea")
                    r["upc"] = response.get("upc")
                    r["sale_unit"] = response.get("saleUnit")
                    r["introduction"] = response.get("introduction")
                    param = response.get("prodParams")
                    r["param"] = param
                    r["credit_amount"] = response.get("credit_amount")
                    r["discount"] = response.get("discount")
                    r["stock"] = response.get("stock")
                    r["source"] = 0
                    skuId = response.get("skuId")
                    ProductModel.objects.filter(sku=skuId).update(**r)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def get_product_image_backend(request):
    '''
    后端获取产品图片数据
    :param request:
    :return:
    '''

    for pobj in ProductModel.objects.all():
        if ProductImageModel.objects.filter(product=pobj).exists():
            pass
        else:
            skudict = {}
            skuIds = []
            skudict["skuId"] = pobj.sku
            skuIds.append(skudict)
            skuIds = json.dumps(skuIds)
            image = requests.get(
                '{}getProductImage?data={{"accessToken":"{}","appKey":"{}","channel":"{}", "skuIds":{}}}'.format(
                    URL, ACCESSTOKEN, APPKEY, CHANNELSN, skuIds))
            try:
                image = json.loads(image.content)
            except Exception as e:
                pass
            else:
                content = image.get("sn_responseContent").get("sn_body").get("queryProdImage")
                if "errorMsg" not in content:
                    images = image["sn_responseContent"]["sn_body"]["queryProdImage"]["resultInfo"]
                    for image in images:
                        sku_obj = ProductModel.objects.get(sku=image.get("skuId"))
                        urls = image["urls"]
                        for i in urls:
                            if i.get("primary") == 1:
                                ProductImageModel.objects.update_or_create(product=sku_obj, image=i.get("path"), is_default=True)
                            else:
                                ProductImageModel.objects.update_or_create(product=sku_obj, image=i.get("path"))
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def get_product_price_backend(request):
    '''
    后端获取产品价格
    :param request:
    :return:
    '''
    product = ProductModel.objects.all()
    for pobj in product:
        if pobj.credit_amount:
            pass
        else:
            sku = []
            mydict = {}
            mydict['skuId'] = pobj.sku
            sku.append(mydict)
            reg = '{}getProductPrice?data={{"accessToken":"{}","appKey":"{}","channel":"{}","cityId":"025","skus":{}}}'.format(
                URL, ACCESSTOKEN, APPKEY, CHANNELSN, json.dumps(sku))
            x = requests.get(reg)
            try:
                price = json.loads(x.content)
            except Exception as e:
                pass
            else:
                content = price.get('sn_responseContent')
                if 'sn_error'not in content:
                    x = price["sn_responseContent"]["sn_body"]["queryPrice"]["skus"]
                    for i in x:
                        sku = i.get("skuId")
                        amount = i.get("price",None)
                        product_obj = ProductModel.objects.get(sku=sku)
                        product_obj.credit_amount = amount
                        product_obj.save()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def get_product_stock_backend(request):
    '''
    后端获取产品库存
    :param request:
    :return:
    '''
    for pobj in ProductModel.objects.all():
        x = requests.get(
            '{}getProductInventory?data={{"accessToken":"{}","appKey":"{}","channel":"{}", "skuId":"{}", "num":"1","cityId":"010","countryId":"05"}}'.format(
                URL,  ACCESSTOKEN, APPKEY, CHANNELSN, pobj.sku))
        try:
            x = json.loads(x.content)
        except Exception as e:
            pass
        else:
            content = x.get("sn_responseContent")
            if "sn_error" not in content:
                resultInfo = x.get("sn_responseContent").get("sn_body").get("getInventory").get("resultInfo")
                for i in resultInfo:
                    productobj = ProductModel.objects.filter(sku=i.get("skuId"))
                    productobj.update(stock=i.get("state"))
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def get_product_list(request):
    '''
    产品列表
    :param request:
    :return:
    '''
    r = {}
    r["erron"] = 0
    resp = HttpResponse()
    productlist = ProductModel.objects.all().values("id","sku","name","image",
                                                         "credit_amount",
                                                         "last_sync",
                                                         "last_change",
                                                         "category_d1__name",
                                                         "category_d1__id",
                                                         "category_d2__id",
                                                         "category_d2__name",
                                                         "category__id",
                                                         "category__name")
    productlist = serializer(productlist,output_type="raw")
    r["productlist"] = productlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_product_list_text(request):
    '''
    产品列表
    :param request:
    :return:
    '''
    r = {}
    r["erron"] = 0
    data = request.GET
    rows = data.get("rows")
    page = data.get("page")
    resp = HttpResponse()
    productlist = Paginator(ProductModel.objects.all().values("id","sku","name","image",
                                                         "credit_amount",
                                                         "last_sync",
                                                         "last_change",
                                                         "category_d1__name",
                                                         "category_d1__id",
                                                         "category_d2__id",
                                                         "category_d2__name",
                                                         "category__id",
                                                         "category__name").order_by("-sku"),int(rows))
    productlist = serializer(productlist.page(int(page)),output_type="raw")
    r["amount"] = ProductModel.objects.all().count()
    r["productlist"] = productlist
    resp.write(json.dumps(r))
    return resp


@login_required
@require_http_methods(["POST"])
def product_delete(request):
    r = {}
    data = request.POST
    pid = data.get("id")
    ProductModel.objects.filter(id=pid).delete()
    r["erron"] = 0
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def product_set(request):
    '''
    修改产品
    :param request:
    :return:
    '''
    data = request.POST
    id = data.get("id")
    name = data.get("name")
    image = data.get("image")
    first_id = data.get("first_id")
    second_id = data.get("second_id")
    third_id = data.get("third_id")
    ProductModel.objects.filter(id=id).update(name=name,image=image,category_d1_id=first_id,
                                              category_d2_id=second_id,category_id=third_id,last_change=timezone.now())
    return HttpResponse(json.dumps(make_success_msg()))

@login_required
@require_http_methods(["GET"])
def get_product_price(request):
    '''
    产品价格信息
    :param request:
    :return:
    '''
    r = {}
    r["erron"] = 0
    resp = HttpResponse()
    productlist = ProductModel.objects.all().values("id", "sku", "name", "image",
                                                    "credit_amount",
                                                    "close_price",
                                                    "float_price",
                                                    "online_price",
                                                    "discount",
                                                    "is_show",
                                                    "last_change")
    productlist = serializer(productlist, output_type="raw")
    r["productlist"] = productlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["POST"])
def product_price_delete(request):
    '''
    删除产品价格信息
    :param request:
    :return:
    '''
    data = request.POST
    pid = data.get("id")
    product_obj = ProductModel.objects.get(id=pid)
    product_obj.is_show = False
    product_obj.save()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def product_price_add_list(request):
    '''
    要增加的产品列表
    :param request:
    :return:
    '''
    resp = HttpResponse()
    r = {}
    productlist = ProductModel.objects.filter(is_show=False).values("id","name","image","credit_amount","category_d1__name",
                                                                    "category_d2__name","category__name")

    productlist = serializer(productlist, output_type="raw")
    r["erron"] = 0
    r["productlist"] = productlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["POST"])
def product_price_add(request):
    '''
    增加显示产品列表
    :param request:
    :return:
    '''
    data = request.POST
    pid = data.get("id")
    product_obj = ProductModel.objects.get(id=pid)
    product_obj.is_show = True
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def product_price_set(request):
    '''
    改变价格
    :param request:
    :return:
    '''
    data = request.POST
    r = {}
    resp = HttpResponse()
    pid = data.get("id")
    state = data.get("state")
    discount = data.get("discount",None)
    discount = float(discount.encode("utf8"))
    product_obj = ProductModel.objects.get(id=pid)
    credit_amount = product_obj.credit_amount
    if discount:
        if state == "up":
            up_price = int(credit_amount) * float(discount/100)
            float_price = int(up_price)
            product_obj.float_price = float_price
            product_obj.online_price = int(up_price) + int(credit_amount)
            product_obj.discount = discount
            product_obj.save()
            resp.write(make_success_msg())
        elif state == "down":
            down_price = int(credit_amount) * float(discount/100)
            float_price = int(credit_amount) - int(down_price)
            product_obj.float_price = float_price
            product_obj.online_price = down_price
            product_obj.discount = discount
            product_obj.save()
            resp.write(make_success_msg())
        return resp
    else:
        r["erron"] = 0
        r["errmsg"] = "No Data Change"
        resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_categroy1(request):
    '''
    获取一级目录
    :param request:
    :return:
    '''
    r = {}
    resp = HttpResponse()
    firstlist = Category1Model.objects.all()
    firstlist = serializer(firstlist,output_type="raw")
    r["erron"] = 0
    r["firstlist"] = firstlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_categroy2(request):
    '''
    获取二级目录
    :param request:
    :return:
    '''
    data = request.GET
    firstid = data.get("id")
    r = {}
    resp = HttpResponse()
    secondlist = Category2Model.objects.filter(parent_id=firstid)
    secondlist = serializer(secondlist,output_type="raw")
    r["erron"] = 0
    r["secondlist"] = secondlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["GET"])
def get_categroy3(request):
    '''
    获取三级目录
    :param request:
    :return:
    '''
    data = request.GET
    secondid = data.get("id")
    r = {}
    resp = HttpResponse()
    thirdlist = Category3Model.objects.filter(parent_id=secondid)
    thirdlist = serializer(thirdlist,output_type="raw")
    r["erron"] = 0
    r["thirdlist"] = thirdlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["POST"])
def category1_set(request):
    data = request.POST
    cid = data.get("id")
    name = data.get("name")
    Category1Model.objects.filter(id=cid).update(name=name)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def category2_set(request):
    data = request.POST
    cid = data.get("id")
    name = data.get("name")
    Category2Model.objects.filter(id=cid).update(name=name)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def category3_set(request):
    data = request.POST
    first_id = data.get("first_id")
    second_id = data.get("second_id")
    third_id = data.get("third_id")
    name = data.get("name")
    Category2Model.objects.filter(id=second_id).update(parent_id=first_id)
    Category3Model.objects.filter(id=third_id).update(name=name,parent_id=second_id)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def category1_delete(request):
    data = request.POST
    cid = data.get("id")
    Category1Model.objects.filter(id=cid).delete()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def category2_delete(request):
    data = request.POST
    cid = data.get("id")
    Category2Model.objects.filter(id=cid).delete()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def category3_delete(request):
    data = request.POST
    cid = data.get("id")
    Category3Model.objects.filter(id=cid).delete()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def main_list(request):
    '''
    轮播图列表
    :param request:
    :return:
    '''

    r = {}
    r['errno'] = 0
    r["productlist"] = []

    mainlist = HomePageCircleModel.objects.all().order_by("-id")
    for i in mainlist:
        s = {}
        s["id"] = i.id
        s["image"] = str(i.image)
        s["backend_iamge"] = str(i.backend_image)
        s["is_default"] = i.is_default
        s["priority"] = i.priority
        s["content"] = i.content
        s["redirect_type"] = i.redirect_type
        r["productlist"].append(s)
    return HttpResponse(json.dumps(r))

@login_required
@require_http_methods(["POST"])
def main_add(request):
    '''
    添加轮播图
    :param request:
    :return:
    '''
    data = request.POST
    image = request.FILES
    content = data.get("content")
    priority = data.get("rankNum")
    is_default = data.get("is_default").capitalize()
    redirect_type = data.get("redirect")
    webImg = image.get("webImg")
    webbgImg = image.get("webbgImg")
    HomePageCircleModel.objects.create(content=content,
                                       priority=priority,
                                       is_default=is_default,
                                       redirect_type=redirect_type,
                                       image=webImg,
                                       backend_image=webbgImg)

    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def main_set(request):
    '''
    编辑轮播图
    :param request:
    :return:
    '''
    data = request.POST
    image = request.FILES
    mid = data.get("id")
    content = data.get("content")
    priority = data.get("rankNum")
    is_default = data.get("is_default").capitalize()
    redirect_type = data.get("redirect")
    webImg = image.get("webImg")
    PATH = os.path.join(MEDIA_ROOT,webImg.name)
    with open(PATH,"wb+") as f:
        for i in webImg.chunks():
            f.write(i)
    webbgImg = image.get("webbgImg",None)
    if webbgImg:
        BGPATH = os.path.join(MEDIA_ROOT, webbgImg.name)
        with open(BGPATH,"wb+") as f:
            for i in webbgImg.chunks():
                f.write(i)
        HomePageCircleModel.objects.filter(id=mid).update(content=content,
                                           priority=priority,
                                           is_default=is_default,
                                           redirect_type=redirect_type,
                                           image=webImg.name,
                                           backend_image=webbgImg.name)
        return HttpResponse(make_success_msg())
    else:
        HomePageCircleModel.objects.filter(id=mid).update(content=content,
                                                          priority=priority,
                                                          is_default=is_default,
                                                          redirect_type=redirect_type,
                                                          image=webImg.name
                                                          )

        return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def main_stant_up_down(request):
    data = request.POST
    mid = data.get("id")
    state = data.get("state").capitalize()
    if state:
        HomePageCircleModel.objects.filter(id=mid).update(is_default=state)
        return HttpResponse(make_success_msg())
    else:
        HomePageCircleModel.objects.filter(id=mid).update(is_default=state)
        return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def main_delete(request):
    '''
    删除轮播图
    :param request:
    :return:
    '''
    data = request.POST
    mid = data.get("id")
    HomePageCircleModel.objects.filter(id=mid).delete()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def main_channel_list(request):
    '''
    首页频道列表
    :param request:
    :return:
    '''
    channellist = ChannelModel.objects.all()
    r = {}
    resp = HttpResponse()
    mainlist = serializer(channellist, output_type="raw")
    r["erron"] = 0
    r["mainlist"] = mainlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["POST"])
def main_channel_add(request):
    '''
    频道列表添加
    :param request:
    :return:
    '''
    data = request.POST
    name = data.get("name")
    image = data.get("image")
    priority = data.get("priority")
    is_default = data.get("is_default").capitalize()
    categroy1id = data.get("first_id")
    ChannelModel.objects.create(is_default=is_default,
                                               name=name,
                                               image=image,
                                               priority=priority,
                                               categtoy_id=categroy1id)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def main_channel_set(request):
    '''
    频道编辑
    :param request:
    :return:
    '''
    data = request.POST
    cid = data.get("id")
    name = data.get("name")
    image = data.get("image")
    priority = data.get("priority")
    categroy1id = data.get("firstid")
    ChannelModel.objects.filter(id=cid).update(name=name,
                                               image=image,
                                               priority=priority,
                                               categtoy_id=categroy1id)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def main_channel_up(request):
    '''
    频道上线
    :param request:
    :return:
    '''
    data = request.POST
    cid = data.get("id")
    ChannelModel.objects.filter(id=cid).update(is_default=True)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def main_channel_down(request):
    '''
    频道下线
    :param request:
    :return:
    '''
    data = request.POST
    cid = data.get("id")
    ChannelModel.objects.filter(id=cid).update(is_default=False)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def main_channel_delete(request):
    '''
    删除频道
    :param request:
    :return:
    '''
    data = request.POST
    cid = data.get("id")
    ChannelModel.objects.filter(id=cid).delete()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def main_channel_watch(request):
    '''
    查看此频道下面的产品
    :param request:
    :return:
    '''
    data = request.GET
    r = {}
    resp = HttpResponse()
    cid = data.get("id")
    channel_obj = ChannelModel.objects.get(id=cid)
    productlist =  channel_obj.product.all().values("id","name","image","sku","is_hot","is_big")
    productlist = serializer(productlist,output_type="raw")
    r['errno'] = 0
    r["productlist"] = productlist
    resp.write(json.dumps(r))
    return resp

@login_required
@require_http_methods(["POST"])
def channel_product_add(request):
    '''
    给此频道添加商品
    :param request:
    :return:
    '''
    data = request.POST
    cid = data.get("cid")
    pid = data.getlist("pid[]")
    channel_obj = ChannelModel.objects.get(id=cid)
    channel_obj.product.add(*pid)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def channel_product_delete(request):
    '''
    此频道删除商品
    :param request:
    :return:
    '''
    data = request.POST
    cid = data.get("cid")
    pid = data.getlist("pid[]")
    cobj = ChannelModel.objects.get(id=cid)
    cobj.product.remove(*pid)
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def set_product_hot(request):
    '''
    添加和删除热卖商品
    :param request:
    :return:
    '''
    data = request.POST
    pid = data.get("id")
    state = data.get("state").capitalize()
    if state:
        ProductModel.objects.filter(id=pid).update(is_hot=state)
        return HttpResponse(make_success_msg())
    else:
        ProductModel.objects.filter(id=pid).update(is_hot=state)
        return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["POST"])
def set_product_image_big(request):
    '''
    设置频道下面的图片为大图
    :param request:
    :return:
    '''
    data = request.POST
    pid = data.get("pid")
    cid = data.get("cid")
    plist = ProductModel.objects.filter(channels_belong_to__id=cid).exclude(id=pid)
    pobj = ProductModel.objects.get(id=pid)
    for i in plist:
        i.is_big = False
        i.save()
    else:
        pobj.is_big = True
        pobj.save()
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def count_order(request):
    '''
    订单销量数据
    :param request:
    :return:
    '''
    order = OrderModel.objects.all()
    orderlist = []

    for i in order:
        a = i.date_created.encode("utf8")
        b = a.split(" ")
        orderlist.append(b[0])
    data = Counter(orderlist)
    countlist = []
    for k,v in data.items():
        r = {}
        r["time"] = k
        r["nub"] = v
        countlist.append(r)
    return HttpResponse(json.dumps(countlist))

@login_required
@require_http_methods(["GET"])
def count_order_state(request):
    '''
    统计订单的状态
    :param request:
    :return:
    '''
    r = {}
    ordernum = OrderModel.objects.all().count()
    successnum = OrderModel.objects.filter(state=0).count()
    nopaynum = OrderModel.objects.filter(state=1).count()
    nosendnub = OrderModel.objects.filter(state=2).count()
    cancelednum = OrderModel.objects.filter(state=4).count()
    r["ordernum"] = ordernum
    r["successnum"] = successnum
    r["nopaynum"] = nopaynum
    r["nosendnub"] = nosendnub
    r["cancelednum"] = cancelednum
    return HttpResponse(json.dumps(r))

@login_required
@require_http_methods(["GET"])
def count_trace(request):
    '''
    访问量数据
    :param request:
    :return:
    '''
    trace = TraceModel.objects.all()
    tracelist = []

    for i in trace:
        a = str(i.date)
        b = a.split(" ")
        tracelist.append(b[0])
    data = Counter(tracelist)
    countlist = []
    for k, v in data.items():
        r = {}
        r["time"] = k
        r["nub"] = v
        countlist.append(r)
    return HttpResponse(json.dumps(countlist))

@login_required
@require_http_methods(["GET"])
def province(request):
    '''
    获取省信息
    :param request:
    :return:
    '''

    response = requests.get(
        '{}fullAddress?data={{"appKey":"{}","accessToken":"{}","channel":"{}"}}'.format(URL, APPKEY, ACCESSTOKEN,
                                                                                        CHANNELSN))

    addrdict = json.loads(response.content)
    addrlist = addrdict["sn_responseContent"]["sn_body"]["getFullAddress"]["resultInfo"]
    for i in addrlist:
        if int(i["level"]) == 1:
            name = i.get("name")
            level = i.get("level")
            pId = i.get("pId")
            nid = i.get("id")
            snId = i.get("snId")
            if ProvinceModel.objects.filter(snid=snId).exists():
                pass
            else:
                ProvinceModel.objects.create(name=name,
                                             level=level,
                                             pId=pId,
                                             nid=nid,
                                             snid=snId,
                                             )

    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def city(request):
    '''
    获取市区地址信息
    :param request:
    :return:
    '''
    response = requests.get(
        '{}fullAddress?data={{"appKey":"{}","accessToken":"{}","channel":"{}"}}'.format(URL, APPKEY, ACCESSTOKEN,
                                                                                        CHANNELSN))

    addrdict = json.loads(response.content)
    addrlist = addrdict["sn_responseContent"]["sn_body"]["getFullAddress"]["resultInfo"]
    for i in addrlist:
        if int(i["level"]) == 2:
            name = i.get("name")
            level = i.get("level")
            pId = i.get("pId")
            nid = i.get("id")
            snId = i.get("snId")
            if CityModel.objects.filter(snid=snId).exists():
                pass
            else:
                CityModel.objects.create(name=name,
                                             level=level,
                                             pId=pId,
                                             nid=nid,
                                             snid=snId
                                             )
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def country(request):
    '''
    获取县地址信息
    :param request:
    :return:
    '''
    response = requests.get(
        '{}fullAddress?data={{"appKey":"{}","accessToken":"{}","channel":"{}"}}'.format(URL, APPKEY, ACCESSTOKEN,
                                                                                        CHANNELSN))

    addrdict = json.loads(response.content)
    addrlist = addrdict["sn_responseContent"]["sn_body"]["getFullAddress"]["resultInfo"]
    for i in addrlist:
        if int(i["level"]) == 3:
            name = i.get("name")
            level = i.get("level")
            pId = i.get("pId")
            nid = i.get("id")
            snId = i.get("snId")
            if DistrictModel.objects.filter(snid=snId).exists():
                pass
            else:
                DistrictModel.objects.create(name=name,
                                             level=level,
                                             pId=pId,
                                             nid=nid,
                                             snid=snId
                                             )
    return HttpResponse(make_success_msg())

@login_required
@require_http_methods(["GET"])
def town(request):
    '''
    获取乡镇地址信息
    :param request:
    :return:
    '''
    response = requests.get(
        '{}fullAddress?data={{"appKey":"{}","accessToken":"{}","channel":"{}"}}'.format(URL, APPKEY, ACCESSTOKEN,
                                                                                        CHANNELSN))

    addrdict = json.loads(response.content)
    addrlist = addrdict["sn_responseContent"]["sn_body"]["getFullAddress"]["resultInfo"]
    for i in addrlist:
        if int(i["level"]) == 4:
            name = i.get("name")
            level = i.get("level")
            pId = i.get("pId")
            nid = i.get("id")
            secondPid = i.get("secondPid")
            snId = i.get("snId")
            if TownModel.objects.filter(snid=snId).exists():
                pass
            else:
                TownModel.objects.create(name=name,
                                         level=level,
                                         pId=pId,
                                         nid=nid,
                                         secondPid=secondPid,
                                         snid=snId
                                         )
    return HttpResponse(make_success_msg())