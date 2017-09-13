from django.shortcuts import render
from pay.cmpay import CMPay
from django.http import HttpResponse
import requests
from i3jf.settings import PAY_PARAM
import uuid
import json
from django.core.exceptions import ObjectDoesNotExist
from .models import *
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required

def make_failed_msg( msg ):
    r = dict()
    r['errno'] = 1
    r['errmsg'] = msg
    return json.dumps(r)

def make_success_msg():
    r = dict()
    r['errno'] = 0
    return json.dumps(r)

# Create your views here.
def cmpay_srv_callback_view(request):
    data = request.POST
    data = CMPay.parse_srv_notify(data)
    if CMPay.verify_srv_response(data):
        try:
            RechargeModel.objects.get( order_id = data['orderId'])
        except ObjectDoesNotExist:
            rm = RechargeModel.objects.create(payno = data['payNo'], return_code = data['returnCode'], message = data['message'], type = data['type']
                                              ,amount = data['amount'], amt_item = data['amtItem'], bank_abbr = data['bankAbbr'],mobile = data['mobile']
                                              ,order_id = data['orderId'], pay_date = data['payDate'], account_date = data['accountDate']
                                              ,status = data['status'], order_date = data['orderDate'], fee = data['fee'] )
        else:
            pass
    else:
        print 'Recharge Srv Callback Verified Failed'
    return HttpResponse("Success")

@login_required
@require_http_methods(["POST"])
def create_recharge_view(request):
    data = request.POST
    credit = data['credit_amount']
    resp = HttpResponse()
    order_id = uuid.uuid1()
    cmpy = CMPay(request)  # 192.168.1.68
    # rm = RechargeModel.objects.create( customer = request.user.customer, order_id = order_id, payno= uuid.uuid1(), amount = credit )
    ret = CMPay.createPayment(cmpy,request.META['REMOTE_ADDR'], credit)
    print ret
    r = {}
    r['errno'] = 0
    r['recharge_id'] = order_id
    r['pay_url'] = r['url']
    r['method'] = r['url']
    return HttpResponse( json.dumps(r))

@require_http_methods(["GET"])
def order_diff_view(request):
    data = request.GET
    credit = data['amount']
    r = {}
    r['errno'] = 0
    r['price'] = 0 if request.user.customer.credit_remaining >= credit else credit - request.user.customer.credit_remaining
    return HttpResponse( json.dumps(r) )

@require_http_methods(["GET"])
def check_recharge_state_view(request):
    resp = HttpResponse()
    data = request.GET
    r={}
    r['errno'] = 0
    try:
        rm = RechargeModel.objects.get( order_id = data['recharge_id'])
    except ObjectDoesNotExist:
        resp.write( make_failed_msg('No Such Recharge Order!'))
    else:
        r['success'] = True if rm.status == 'SUCCESS' else False
    finally:
        return resp

