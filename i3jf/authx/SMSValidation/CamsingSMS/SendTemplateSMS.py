#-*- coding: UTF-8 -*-

import ConfigParser
from xml.dom import minidom
import requests

userid = 14
account = 'bjcxss'
password = 'ABC123456'
client_url = '39.108.63.95:8088'

request_url = 'http://{}/sms.aspx'.format(client_url)

def sendTemplateSMS(to, validationTxt):
    content = '【亲子跑】您的验证码是：{}，请在30分钟内完成验证'.format(validationTxt)
    action = 'action=send&userid={}&account={}&password={}&mobile={}&content="{}"&sendTime=&extno='.format( userid, account, password, to,content)
    final_url = request_url + '?'+ action
    print final_url
    r = requests.post(final_url)
    result = minidom.parseString(r.content)
    status = result.getElementsByTagName('returnstatus')[0].firstChild.data
    return status == 'Success'
