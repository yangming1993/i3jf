#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Create your views here.
from django.shortcuts import render
import hashlib
from .models import *
from dss.Serializer import serializer
# Create your views here.
from django.contrib import auth
from django.contrib.auth.models import User
from product.models import *
from area.models import *
import datetime
from django.http import Http404, HttpResponse
from dss.Serializer import serializer
from authx.SMSValidation.SMSAgent import sendSMS
from SMSValidation.SMSValidationMgr import gSMSValidationMgr
from django.contrib.auth.decorators import login_required
from ipware.ip import get_real_ip
from django.core.files import File
import random
from decimal import Decimal
from django.views.decorators.http import require_http_methods
from django.db.models import Q,F
from django.db.models import Avg,Min,Sum,Max
from .forms import *
from captcha.models import CaptchaStore
from captcha.helpers import *
import json
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.core.paginator import Paginator
from .miscs import *
from i3jf.settings import STATICFILES_DIRS
import requests
from i3jf.settings import BASE_DIR, STATIC_URL, CAPTCHA_URL, CAPTCHA_DIR, ALI_SMS_API
import os
import logging
logger = logging.getLogger(__name__)

URL = 'http://127.0.0.1:8000/i3jf/'

def make_failed_msg(msg):
    r = dict()
    r['errno'] = 1
    r['errmsg'] = msg
    return json.dumps(r)

def make_success_msg():
    r = dict()
    r['errno'] = 0
    return json.dumps(r)


def index(request):
    return render(request,"i3jf/index.html",{"static_url":STATIC_URL+"i3jf/"})

def helper(request):
    return render(request,'i3jf/help.html',{"static_url":STATIC_URL+"i3jf/"})

def helper_content(request):
    data = request.GET
    mi = data.get("main")
    sub = data.get("sub")
    if mi == "0":
        if sub == "0":
            return render(request,"i3jf/helpPages/account.html",{"static_url":STATIC_URL+"i3jf/"})
        elif sub == "1":
            return render(request, "i3jf/helpPages/recharge.html", {"static_url": STATIC_URL + "i3jf/"})
        elif sub == "2":
            return render(request, "i3jf/helpPages/use.html", {"static_url": STATIC_URL + "i3jf/"})
        else:
            return render(request, "i3jf/helpPages/examples.html", {"static_url": STATIC_URL + "i3jf/"})
    elif mi == "1":
        if sub == "0":
            return render(request,"i3jf/helpPages/orderManage.html",{"static_url":STATIC_URL+"i3jf/"})
        elif sub == "1":
            return render(request, "i3jf/helpPages/deliveryMethod.html", {"static_url": STATIC_URL + "i3jf/"})
        elif sub == "2":
            return render(request, "i3jf/helpPages/deliverySearch.html", {"static_url": STATIC_URL + "i3jf/"})
        else:
            return render(request, "i3jf/helpPages/deliveryIntroduce.html", {"static_url": STATIC_URL + "i3jf/"})
    elif mi == "2":
        if sub == "0":
            return render(request,"i3jf/helpPages/returnPolicy.html",{"static_url":STATIC_URL+"i3jf/"})
        elif sub == "1":
            return render(request, "i3jf/helpPages/returnProcess.html", {"static_url": STATIC_URL + "i3jf/"})
        elif sub == "2":
            return render(request, "i3jf/helpPages/returnIntroduce.html", {"static_url": STATIC_URL + "i3jf/"})
        else:
            return render(request, "i3jf/helpPages/customerService.html", {"static_url": STATIC_URL + "i3jf/"})
    elif mi == "3":
        if sub == "0":
            return render(request,"i3jf/helpPages/integralIn.html",{"static_url":STATIC_URL+"i3jf/"})
        elif sub == "1":
            return render(request, "i3jf/helpPages/integralOut.html", {"static_url": STATIC_URL + "i3jf/"})
        else:
            return render(request, "i3jf/helpPages/cooperation.html", {"static_url": STATIC_URL + "i3jf/"})
    else:
        if sub == "0":
            return render(request,"i3jf/helpPages/about.html",{"static_url":STATIC_URL+"i3jf/"})
        elif sub == "1":
            return render(request, "i3jf/helpPages/protocol.html", {"static_url": STATIC_URL + "i3jf/"})
        elif sub == "2":
            return render(request, "i3jf/helpPages/legalDeclaration.html", {"static_url": STATIC_URL + "i3jf/"})
        else:
            return render(request, "i3jf/helpPages/question.html", {"static_url": STATIC_URL + "i3jf/"})


@require_http_methods(["GET"])
def get_captcha_view(request):
    csn = gCaptchaGenerator.Generate()
    name = str(uuid.uuid1())
    local_img = os.path.join( CAPTCHA_DIR, name )
    csn[0].save( local_img, "PNG")
    request.session['captcha'] = csn[1]
    cimageurl = CAPTCHA_URL + name
    result = json.dumps( { 'errno': 0, 'captcha_url':cimageurl , 'errmsg' :"" } )
    return HttpResponse(result, content_type="application/json")

@require_http_methods(["GET"])
def check_mobile_view(request):
    data = request.GET
    resp = HttpResponse()
    if User.objects.filter( username = data['mobile'] ).exists():
        resp.write(make_failed_msg('Mobile Already Registered'))
    else:
        resp.write( make_success_msg())
    return resp

@require_http_methods(["GET"])
def check_captcha_view(request):
    data = request.GET
    resp = HttpResponse()
    if request.session['captcha'].lower() == data['captcha'].lower():
        resp.write(make_success_msg())
    else:
        resp.write(make_failed_msg('AlreadyRegistered'))
    return resp

@require_http_methods(["GET"])
def send_verification_code_view(request):
    data = request.GET
    resp = HttpResponse()
    phone = data['telephone']
    if User.objects.filter(username=phone).exists():
        resp.write( make_failed_msg('AlreadyRegistered') )
    else:
        code = gSMSValidationMgr.ValidationAvailable( request, 'register_sms_data')
        if code == '':
            if gSMSValidationMgr.isDebugCode(phone):
                validationTxt = phone
                gSMSValidationMgr.AddValidation(request, 'register_sms_data', validationTxt )
                resp.write( make_success_msg() )
            else:
                validationTxt = str(random.randrange(100000, 999999, 1))
                #ip = get_real_ip(request)
                ip = request.META['REMOTE_ADDR']
                if ip is not None:
                    # we have a real, public ip address for user
                    sendSMS(ip, phone, validationTxt, ALI_SMS_API['SMS_RegisterTemplate'])
                    gSMSValidationMgr.AddValidation(request, 'register_sms_data', validationTxt)
                    resp.write( make_success_msg())
                else:
                    # we don't have a real, public ip address for user
                    resp.write( make_failed_msg( "FakeIP" ))
        else:
            resp.write( make_failed_msg("Too Fast") )
    return resp

@require_http_methods(["GET"])
def check_verification_code_view(request):
    '''
    手机验证码验证
    :param request:
    :return:
    '''
    data = request.GET
    resp = HttpResponse()
    phone = data['telephone']
    code_to_check = str(data['code'].encode("utf8"))
    code = gSMSValidationMgr.GetValidationCode( request, 'register_sms_data' )
    logger.debug("The code_to_check is {} and The code is {}".format(code_to_check,code))
    if str(code) == str(code_to_check):
        gSMSValidationMgr.MoveToPendingValidation(request, 'register_sms_data')
        request.session['phonenumber'] = phone
        resp.write( make_success_msg() )
    else:
        resp.write( make_failed_msg( "Not Match" ) )
    return resp

def register(request):
    return render(request,"i3jf/register.html",{"static_url":STATIC_URL+"i3jf/"})

@require_http_methods(["POST"])
def register_view(request):
    resp = HttpResponse()
    data = request.POST
    if 'phonenumber' not in request.session:
        resp.write( make_failed_msg('Security Bleach!'))
    else:
        phone = request.session['phonenumber']
        if not User.objects.filter( username = phone).exists():
            if gSMSValidationMgr.IsValidated( request, 'register_sms_data' ):
                gSMSValidationMgr.RemovePendingValidation( request, 'register_sms_data' )
                user = User.objects.create_user( username = phone, password= data['password'])
                if user is None:
                    resp.write( make_failed_msg("Unknown Error"))
                else:
                    customer = CustomerModel.objects.create()
                    customer.auth = user
                    customer.phone = phone
                    customer.save()
                    resp.write( make_success_msg() )
            else:
                resp.write(make_failed_msg('Security Bleach!'))
        else:
            resp.write(make_failed_msg('Already Registered!'))
    return resp

def login(request):
    return render(request,"i3jf/login.html",{"static_url":STATIC_URL+"i3jf/"})

@require_http_methods(["POST"])
def login_view(request):
    resp = HttpResponse()
    data = request.POST
    username = data.get("mobile")
    user = auth.authenticate( username = username, password = data['password'])
    if user is None:
        resp.write( make_failed_msg( "PW Mismatch") )
    elif user.is_active:
        auth.login( request, user)
        resp.write( make_success_msg() )
    else:
        resp.write( make_failed_msg('Account Frozen'))
    return resp

def forgetpassword(request):
    return render(request,"i3jf/password_retrieval.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def password_set(request):
    return render(request, "i3jf/login_modification.html", {"static_url": STATIC_URL + "i3jf/"})

@login_required
@require_http_methods(["POST"])
def password_change_view(request):
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
        resp.write( make_success_msg() )
    else:
        resp.write(make_failed_msg('Unknown Error'))
    return resp

@login_required
@require_http_methods(["POST"])
def logout_view(request):
    auth.logout(request)
    resp = HttpResponse()
    resp.write( make_success_msg() )
    return resp

@login_required
@require_http_methods(["GET"])
def address_list_view(request):
    resp = HttpResponse()
    addrdata = []
    address_objs = request.user.customer.address_list.all()
    for i in address_objs:
        r = {}
        r['errno'] = 0
        r["errmsg"] = "successful"
        r['province_id'] =  ProvinceModel.objects.get(id=i.province_id).name
        r['city_id'] =  CityModel.objects.get(id=i.city_id).name
        r['district_id'] =  DistrictModel.objects.get(id=i.county_id).name
        r['town_id'] =  TownModel.objects.get(id=i.town_id).name
        r['province_Id'] = ProvinceModel.objects.get(id=i.province_id).nid
        r['city_Id'] = CityModel.objects.get(id=i.city_id).nid
        r['district_Id'] = DistrictModel.objects.get(id=i.county_id).nid
        r['town_Id'] = TownModel.objects.get(id=i.town_id).nid

        r["id"] = i.id
        r["telephone"] = i.telephone
        r["contact"] = i.contact
        r["name"] = i.name
        r["address_detail"] = i.address_detail
        r["is_default"] = i.is_default
        addrdata.append(r)
    resp.write(json.dumps(addrdata))
    return resp

@login_required
@require_http_methods(["POST"])
def address_remove_view(request):
    resp = HttpResponse()
    data = request.POST
    try:
        o = AddressModel.objects.get( id = data['id'])
    except ObjectDoesNotExist:
        resp.write( make_failed_msg('No Such Address'))
    else:
        if o.is_default:
            if request.user.customer.address_list.count() > 0:
                nd = request.user.customer.address_list.all()[0]
                nd.is_default = True
                nd.save()
        o.delete()
        resp.write( make_success_msg())
    return resp


@login_required
@require_http_methods(["POST"])
def address_create_view(request):
    data = request.POST
    AddressModel.objects.create( customer = request.user.customer, telephone=data['telephone'], contact = data['contact'],
                                           province_id = data['province_id'], city_id = data['city_id'], county_id = data['county_id'],
                                           town_id=data['town_id'],address_detail = data['address_detail'],name = data['name'])  # ,is_default = data['is_default']
    return HttpResponse( make_success_msg() )

@login_required
@require_http_methods(["POST"])
def address_update_view(request):
    data = request.POST
    resp = HttpResponse()
    try:
        address = request.user.customer.address_list.get( id = data['id'])
    except ObjectDoesNotExist:
        resp.write( make_failed_msg("No Such Address"))
    else:
        address.telephone=data['telephone']
        address.contact = data.get("contact")
        address.province_id = data['province_id']
        address.city_id = data['city_id']
        address.county_id = data['county_id']
        address.town_id=data['town_id']
        address.address_detail = data['address_detail']
        address.name = data['name']
        address.save()
        if data['is_default'] == True:
            address.is_default = True
            try:
                pd = request.user.customer.address_list.get( is_default = True )
            except ObjectDoesNotExist:
                pass
            else:
                pd.is_default = False
                pd.save()
        else:
            address.is_default = False
        resp.write( make_success_msg() )
    return HttpResponse( make_success_msg() )

@login_required
@require_http_methods(["POST"])
def address_set_default_view(request):
    resp = HttpResponse()
    data = request.POST
    try:
        o = AddressModel.objects.get( id = data['id'])
        s = request.user.customer.address_list.exclude(id = data["id"])
        for i in s:
            i.is_default = False
            i.save()
    except ObjectDoesNotExist:
        resp.write( make_failed_msg('No Such Address'))
    else:
        o.is_default = True
        o.save()
        resp.write( make_success_msg())
    return resp

@login_required
def personalCenter(request):
    return render(request,"i3jf/personal_center.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def Point_inquire(request):
    return render(request,"i3jf/integral_query.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def recharge(request):
    return render(request,"i3jf/recharge_hebao.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def order_recharge(request):
    return render(request,"i3jf/recharge.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
def my_follow(request):
    return render(request,"i3jf/myfollow.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
@require_http_methods(["POST"])
def update_profile_view(request):
    customer = request.user.customer
    data = request.POST
    customer.realname = data['realname']
    customer.nickname = data['nickname']
    customer.gender = data['gender']
    customer.save()
    return HttpResponse( make_success_msg())

@login_required
@require_http_methods(["GET"])
def retrieve_profile_view(request):
    resp = HttpResponse()
    customer = request.user.customer
    data = {}
    data['errno'] = 0
    data['realname'] = customer.realname
    data['nickname'] = customer.nickname
    data['gender'] = customer.gender
    data['telephone'] = request.user.username
    data['email'] = customer.email
    data['pay_password_status'] = False if len(customer.pay_password)== 0 else True
    resp.write(json.dumps(data))
    return resp

@require_http_methods(["GET"])
def forget_password_get_verification_code_view(request):
    resp = HttpResponse()
    # phone = request.user.username
    phone = request.GET.get("telephone")
    code = gSMSValidationMgr.ValidationAvailable(request, 'forgetpassword_sms_data')
    if code == '':
        if gSMSValidationMgr.isDebugCode(phone):
            validationTxt = phone
            gSMSValidationMgr.AddValidation(request, 'forgetpassword_sms_data', validationTxt)
            resp.write(make_success_msg())
        else:
            validationTxt = str(random.randrange(100000, 999999, 1))
            # ip = get_real_ip(request)
            ip = request.META['REMOTE_ADDR']
            if ip is not None:
                    # we have a real, public ip address for user
                sendSMS(ip, phone, validationTxt, ALI_SMS_API['SMS_ForgetPasswordTemplate'])
                gSMSValidationMgr.AddValidation(request, 'forgetpassword_sms_data', validationTxt)
                resp.write(make_success_msg())
            else:
                    # we don't have a real, public ip address for user
                resp.write(make_failed_msg("FakeIP"))
    else:
        resp.write(make_failed_msg("Too Fast"))
    return resp

@require_http_methods(["GET"])
def forget_password_check_verification_code_view(request):
    data = request.GET
    resp = HttpResponse()
    phone = data['telephone']
    code_to_check =  data['code']
    code = gSMSValidationMgr.GetValidationCode(request, 'forgetpassword_sms_data')
    if code == code_to_check:
        resp.write( make_success_msg() )
        request.session['phonenumber'] = phone
        gSMSValidationMgr.MoveToPendingValidation(request, 'forgetpassword_sms_data')
    else:
        resp.write( make_failed_msg( "Not Match" ) )
    return resp

@require_http_methods(["POST"])
def forget_password_view(request):
    resp = HttpResponse()
    data = request.POST
    if 'phonenumber' not in request.session:  #:
        resp.write(make_failed_msg('Security Bleach!'))
    else:
        phone = request.session['phonenumber']
        try:
            user = User.objects.get( username=phone)
        except ObjectDoesNotExist:
            resp.write( make_failed_msg('No Such User'))
        else:
            if gSMSValidationMgr.IsValidated(request, 'forgetpassword_sms_data'):
                gSMSValidationMgr.RemovePendingValidation(request, 'forgetpassword_sms_data')
                user.set_password(data['new_password'])
                user.save()
                resp.write(make_success_msg())
            else:
                resp.write(make_failed_msg('Security Bleach!'))
    return resp

@login_required
@require_http_methods(["GET"])
def change_telephone_get_verification_code_for_old_view(request):
    resp = HttpResponse()
    phone = request.user.username
    code = gSMSValidationMgr.ValidationAvailable(request, 'changetelephoneforold_sms_data')
    if code == '':
        if gSMSValidationMgr.isDebugCode(phone):
            validationTxt = phone
            gSMSValidationMgr.AddValidation(request, 'changetelephoneforold_sms_data', validationTxt)
            resp.write(make_success_msg())
        else:
            validationTxt = str(random.randrange(100000, 999999, 1))
            # ip = get_real_ip(request)
            ip = request.META['REMOTE_ADDR']
            if ip is not None:
                    # we have a real, public ip address for user
                sendSMS(ip, phone, validationTxt, ALI_SMS_API['SMS_ChangeTelephoneForOldTemplate'])
                gSMSValidationMgr.AddValidation(request, 'changetelephoneforold_sms_data', validationTxt)
                resp.write(make_success_msg())
            else:
                    # we don't have a real, public ip address for user
                resp.write(make_failed_msg("FakeIP"))
    else:
        resp.write(make_failed_msg("Too Fast"))
    return resp

@login_required
@require_http_methods(["GET"])
def change_telephone_check_verification_code_for_old_view(request):
    data = request.GET
    resp = HttpResponse()
    phone = data['telephone']
    code_to_check =  data['code']
    code = gSMSValidationMgr.GetValidationCode(request, 'changetelephoneforold_sms_data')
    if code == code_to_check:
        resp.write( make_success_msg() )
        request.session['old_phonenumber'] = phone
        gSMSValidationMgr.MoveToPendingValidation(request, 'changetelephoneforold_sms_data')
    else:
        resp.write( make_failed_msg( "Not Match" ) )
    return resp


@login_required
@require_http_methods(["GET"])
def change_telephone_get_verification_code_for_new_view(request):
    resp = HttpResponse()
    phone = request.user.username
    code = gSMSValidationMgr.ValidationAvailable(request, 'changetelephone_sms_data')
    if code == '':
        if gSMSValidationMgr.isDebugCode(phone):
            validationTxt = phone
            gSMSValidationMgr.AddValidation(request, 'changetelephone_sms_data', validationTxt)
            resp.write(make_success_msg())
        else:
            validationTxt = str(random.randrange(100000, 999999, 1))
            # ip = get_real_ip(request)
            ip = request.META['REMOTE_ADDR']
            if ip is not None:
                    # we have a real, public ip address for user
                sendSMS(ip, phone, validationTxt, ALI_SMS_API['SMS_ChangeTelephoneForNewTemplate'])
                gSMSValidationMgr.AddValidation(request, 'changetelephone_sms_data', validationTxt)
                resp.write(make_success_msg())
            else:
                    # we don't have a real, public ip address for user
                resp.write(make_failed_msg("FakeIP"))
    else:
        resp.write(make_failed_msg("Too Fast"))
    return resp


@login_required
@require_http_methods(["GET"])
def change_telephone_check_verification_code_for_new_view(request):
    data = request.GET
    resp = HttpResponse()
    phone = data['telephone']
    code_to_check =  data['code']
    code = gSMSValidationMgr.GetValidationCode(request, 'changetelephone_sms_data')
    if code == code_to_check:
        resp.write( make_success_msg() )
        request.session['new_phonenumber'] = phone
        gSMSValidationMgr.MoveToPendingValidation(request, 'changetelephone_sms_data')
    else:
        resp.write( make_failed_msg( "Not Match" ) )
    return resp


@login_required
@require_http_methods(["PUT"])
def change_telephone_view(request):
    resp = HttpResponse()
    data = request.POST
    if 'new_phonenumber' not in request.session and 'old_phonenumber' not in request.session:  #:
        resp.write(make_failed_msg('Security Bleach!'))
    else:
        old_phone = request.session['old_phonenumber']
        new_phone = request.session['new_phonenumber']
        if gSMSValidationMgr.IsValidated(request, 'changetelephone_sms_data') and gSMSValidationMgr.IsValidated(request, 'changetelephoneforold_sms_data'):
            gSMSValidationMgr.RemovePendingValidation(request, 'changetelephone_sms_data')
            gSMSValidationMgr.RemovePendingValidation(request, 'changetelephoneforold_sms_data')
            request.user.username = request.session['new_phonenumber']
            request.user.save()
            resp.write(make_success_msg())
        else:
            resp.write(make_failed_msg('Security Bleach!'))
    return resp

@login_required
@require_http_methods(["GET"])
def pay_password_get_verification_code_view(request):
    resp = HttpResponse()
    phone = request.user.username
    code = gSMSValidationMgr.ValidationAvailable(request, 'paypassword_sms_data')
    if code == '':
        if gSMSValidationMgr.isDebugCode(phone):
            validationTxt = phone
            gSMSValidationMgr.AddValidation(request, 'paypassword_sms_data', validationTxt)
            resp.write(make_success_msg())
        else:
            validationTxt = str(random.randrange(100000, 999999, 1))
            # ip = get_real_ip(request)
            ip = request.META['REMOTE_ADDR']
            if ip is not None:
                    # we have a real, public ip address for user
                sendSMS(ip, phone, validationTxt, ALI_SMS_API['SMS_PayPasswordTemplate'])
                gSMSValidationMgr.AddValidation(request, 'paypassword_sms_data', validationTxt)
                resp.write(make_success_msg())
            else:
                    # we don't have a real, public ip address for user
                resp.write(make_failed_msg("FakeIP"))
    else:
        resp.write(make_failed_msg("Too Fast"))
    return resp

@login_required
@require_http_methods(["GET"])
def pay_password_check_verification_code_view(request):
    data = request.GET
    resp = HttpResponse()
    phone = data['telephone']
    code_to_check =  data['code']
    code = gSMSValidationMgr.GetValidationCode(request, 'paypassword_sms_data')
    if code == code_to_check:
        resp.write( make_success_msg() )
        request.session['phonenumber'] = phone
        gSMSValidationMgr.MoveToPendingValidation(request, 'paypassword_sms_data')
    else:
        resp.write( make_failed_msg( "Not Match" ) )
    return resp

@login_required
def set_pay_password(request):
    return render(request,'i3jf/payment_modification.html',{"static_url":STATIC_URL+"i3jf/"})

@login_required
def change_pay_password(request):
    return render(request,'i3jf/modify_payment.html',{"static_url":STATIC_URL+"i3jf/"})

@login_required
def phone(request):
    return render(request, 'i3jf/phone_modification.html', {"static_url": STATIC_URL + "i3jf/"})

@login_required
@require_http_methods(["POST"])
def pay_password_view(request):
    resp = HttpResponse()
    data = request.POST
    md5 = hashlib.md5()
    md5.update(data['newpassword'])
    request.user.customer.pay_password = md5.hexdigest()
    request.user.customer.save()
    resp.write(make_success_msg())
    return resp

@login_required
@require_http_methods(["GET"])
def get_credit_view(request):
    customer = request.user.customer
    r = {}
    r['credit'] = str(customer.credit_remaining)
    r['errno'] = 0
    return HttpResponse(json.dumps(r))


@login_required
@require_http_methods(["POST"])
def create_favourite_view(request):
    data = request.POST
    resp = HttpResponse()
    customer = request.user.customer
    try:
        product = ProductModel.objects.get( sku = data['sku'] )
    except ObjectDoesNotExist:
        resp.write( make_failed_msg('No Such Product') )
    else:
        if customer.my_favourite_list.filter( product = product ).exists():
            resp.write(make_failed_msg('Already Favourite'))
        else:
            FavouriteModel.objects.create( customer = customer, product = product )
            resp.write( make_success_msg() )
    return resp


@login_required
@require_http_methods(["POST"])
def remove_favourite_view(request):
    data = request.POST
    resp = HttpResponse()
    customer = request.user.customer
    try:
        favourite = customer.my_favourite_list.get( id = data['id'] )
    except ObjectDoesNotExist:
        resp.write(make_failed_msg('No Such Favourite Record'))
    else:
        favourite.delete()
        resp.write( make_success_msg() )
    return resp


@login_required
@require_http_methods(["GET"])
def list_favourite_view(request):
    customer = request.user.customer
    li = list(customer.my_favourite_list.all())
    r = {}
    r['errno'] = 0
    r['list'] = [(lambda f: {'id': f.id, 'sku':f.product.sku,
                             'name':f.product.name,
                             'amount':str(f.product.credit_amount),
                             "image":f.product.image,
                            "date_created":str(f.date_created)
                             })(f)
                 for f in li]
    return HttpResponse(json.dumps(r))

@login_required
def mycart(request):
    return render(request,"i3jf/shopping_cart.html",{"static_url":STATIC_URL+"i3jf/"})

@login_required
@require_http_methods(["POST"])
def create_cart_view(request):
    data = request.POST
    if data.get("amount"):
        amount = data.get("amount")
    else:
        amount = 1
    resp = HttpResponse()
    customer = request.user.customer
    try:
        product = ProductModel.objects.get(sku=data['sku'])
    except ObjectDoesNotExist:
        resp.write(make_failed_msg('No Such Product'))
    else:
        if CartModel.objects.filter(product=product,customer=customer).count():
            CartModel.objects.filter(product=product,customer=customer).update(amount=F("amount")+amount)
        else:
            cart = CartModel.objects.create(product=product, customer=customer, amount=amount)
        resp.write(make_success_msg())
    return resp

@login_required
@require_http_methods(["GET"])
def list_cart_view(request):
    customer = request.user.customer
    r = {}
    r['errno'] = 0
    r['list'] = [(lambda cart: {'id': cart.id, 'name': cart.product.name, 'image': cart.product.image, 'price': str(cart.product.credit_amount),
                             'sku': cart.product.sku,'amount': cart.amount})(c) for c in list( request.user.customer.my_cart_list.all().order_by("-date_created")) ]

    return HttpResponse( json.dumps(r) )

@login_required
@require_http_methods(["POST"])
def update_cart_view(request):
    '''
    更新产品数量
    :param request:
    :return:
    '''
    data = request.POST
    resp = HttpResponse()
    customer = request.user.customer
    try:
        item = customer.my_cart_list.get( id = data['id'] )
    except ObjectDoesNotExist:
        resp.write(make_failed_msg('No Such Cart Record'))
    else:
        item.amount = data['amount']
        item.save()
        resp.write( make_success_msg() )
    return resp

@login_required
@require_http_methods(["POST"])
def batch_remove_cart_view(request):
    data = request.POST
    data = data.getlist("id_list[]")
    resp = HttpResponse()
    customer = request.user.customer
    customer.my_cart_list.filter(id__in=data).delete()
    resp.write( make_success_msg() )
    return resp

@login_required
@require_http_methods(["GET"])
def get_cart_amount(request):
    r = {}
    user = request.user.customer
    amount = CartModel.objects.filter(customer=user).aggregate(Sum("amount"))
    if amount.get("amount__sum"):
        r["amount"] = amount.get("amount__sum")
    else:
        r["amount"] = 0
    r["errno"] = 0
    r["errmsg"] = "SUCCESSFUL"
    return HttpResponse(json.dumps(r))

@login_required
def trace(request):
    return render(request,'i3jf/footprint.html',{"static_url":STATIC_URL+"i3jf/"})

@login_required
@require_http_methods(["POST"])
def create_trace(request):
    data = request.POST
    user = request.user.customer
    sku = data.get("sku")
    try:
        product_obj = ProductModel.objects.get(sku=sku)
    except ObjectDoesNotExist:
        return HttpResponse(make_failed_msg("No Such Product"))
    else:
        TraceModel.objects.create(customer=user,product=product_obj)
        return HttpResponse(make_success_msg())


@login_required
@require_http_methods(["GET"])
def list_trace_view(request):
    '''
    足迹列表
    :param request:
    :return:
    '''
    data = request.GET
    paginator = Paginator(request.user.customer.my_trace_list.all().order_by("-date"), data['rows'])
    r = {}
    r['errno'] = 0
    r['list'] = [(lambda cart: { "date":str(cart.date),'name': cart.product.name, 'image': cart.product.image, 'price': str(cart.product.credit_amount),
                             'sku': cart.product.sku})(c) for c in paginator.page(data["page"])]
    r['total'] = request.user.customer.my_trace_list.count()
    return HttpResponse( json.dumps(r) )
#url<hi:=>https://ipos.10086.cn/ips/FormTrans3<hi:$$>method<hi:=>post<hi:$$>sessionId<hi:=>2011010199999

@login_required
@require_http_methods(["POST"])
def create_recharge_view(request):
    data = request.POST
    credit_amount = data['credit_amount']
    return_type = data['return_type']
    w =''
    rcontent = requests.post( w, verify=False)
    base_url, method, session_id = rcontent.split('<hi:$$>')
    r={}
    r['errno'] = 0
    r['method'] = method.split('<hi:=>')[1]
    r['url'] = base_url+'.dow?SESSIONID='+ session_id.split('<hi:=>')[1]
    return HttpResponse( json.dumps(r))


@login_required
@require_http_methods(["GET"])
def diff_recharge_view(request):
    data = request.GET
    r = {}
    r['errno'] = 0
    r['to_pay'] = request.user.customer.credit_remaining - data['amount']
    return HttpResponse(json.dumps(r))


