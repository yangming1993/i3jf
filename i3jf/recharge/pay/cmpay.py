# -*- coding: utf-8 -*-
from i3jf.settings import PAY_PARAM
import requests
import datetime
import uuid
import hashlib
class CMPay():
    params = {}
    def __init__(self, request):
        self.params['characterSet'] = "02"  # 00 - -gbk  01 - -gb2312   02 - -utf - 8
        self.params['callbackUrl'] = "/api/recharge/cmpay_success"  # 网页回调地址(支付)
        self.params['notifyUrl'] = "/api/recharge/cmpay_success"
        self.params['ipAddress'] = ''
        self.params['merchantId'] = "888009962120010"  #PAY_PARAM['cm_pay']['merchant_id']
        self.params['requestId'] = ''
        self.params['signType'] = "MD5"
        self.params['type'] = 'DirectPayConfirm'
        self.params['version'] = "2.0.0"
        # self.params['merchantCert'] = ''


        self.params['amount'] = ''
        self.params['bankAbbr'] = ''
        self.params['currency'] = '00'
        self.params['orderDate'] = ''
        self.params['orderId'] = ''
        self.params['merAcDate'] = ''
        self.params['period'] = '1'
        self.params['periodUnit'] = '01'#00- 分01- 小时02- 日
        self.params['merchantAbbr'] = ''
        self.params['productDesc'] = ''
        self.params['productId']=''
        self.params['productName'] = 'productName'
        self.params['productNum'] = ''
        self.params['reserved1'] = ''
        self.params['reserved2'] = ''
        self.params['userToken'] = ''
        self.params['showUrl'] = ''
        self.params['couponsFlag'] = ''
        self.params['hmac'] = ''


    def createPayment(self,client_ip, credit_recharge):
        self.params['ipAddress'] = str(client_ip)
        self.params['requestId'] = str(uuid.uuid1())
        self.params['amount'] = credit_recharge
        cur_date =str(datetime.date.today()).replace('-','')

        self.params['orderDate'] = str(cur_date)
        self.params['orderId'] = str(uuid.uuid1())
        self.params['merAcDate'] = str(cur_date)
        self.params['hmac'] = self.sign()
        w = '&'.join([ (lambda m,v: k+'='+v) (k,v) for k,v in self.params.items()])
        print w
        # print PAY_PARAM['cm_pay']['req_url'] + "?"+w
        rcontent = requests.get( PAY_PARAM['cm_pay']['req_url'] + "?" + w, verify = True )
        print rcontent.content
        return self.parseUrl(rcontent.content)

    def sign(self):
        signData = self.params['characterSet'] +\
        self.params['callbackUrl'] +\
        self.params['notifyUrl'] +\
        self.params['ipAddress'] +\
        self.params['merchantId'] +\
        self.params['requestId'] +\
        self.params['signType'] +\
        self.params['type'] +\
        self.params['version']

        md5 = hashlib.md5()
        md5.update(signData)
        return md5.hexdigest()
    

    """
    功能
    把http请求返回数组
    格式化成数组
    """
    def parse_client_notify(self,rcontent ):
        ret = {}
        l = rcontent.split('&')
        for i in l:
            kv = i.split('=')
            ret[kv[0]] = kv[1]
        return ret

    def parse_srv_notify(self,rcontent):
        ret = {}
        l = rcontent.split('&')
        for i in l:
            kv = i.split('=')
            ret[kv[0]] = kv[1]
        return ret
    # 返回URL处理
    def parseUrl(self,rcontent ):
        base_url, method, session_id = rcontent.split('$') #<hi:$$>
        r = {}
        r['method'] = method.split('<hi:=>')[1]
        r['url'] = base_url + '.dow?SESSIONID=' + session_id.split('<hi:=>')[1]
        return r


    def verify_srv_response(self,data):
        sign_data = data['merchantId']+\
                    data['payNo']+\
                    data['returnCode']+\
                    data['message']+\
                    data['signType']+\
                    data['type']+\
                    data['version']+\
                    data['amount']+\
                    data['amtItem']+\
                    data['bankAbbr']+\
                    data['mobile']+\
                    data['orderId']+\
                    data['payDate']+\
                    data['accountDate']+\
                    data['reserved1']+\
                    data['reserved2']+\
                    data['status']+\
                    data['orderDate']+\
                    data['fee']+\
                    data['serverCert']
        if data['signType'] == 'MD5':
            m = hashlib.md5()
            m.update(sign_data)
            s = m.hexdigest
            return s == data['hmac']
        else:
            return False
# gCMPay = CMPay(requests)
