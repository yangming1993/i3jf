#coding=gbk

#coding=utf-8

#-*- coding: UTF-8 -*-  

from CCPRestSDK import REST
import ConfigParser

#主帐号
accountSid= 'aaf98f8951d8d1c10151e7903d6d32fc';

#主帐号Token
accountToken= '684d70c6642f40edaa7337a2354911e4';

#应用Id
appId='8a48b55151e720740151e79197700151';

#请求地址，格式如下，不需要写http://
serverIP='sandboxapp.cloopen.com';

#请求端口 
serverPort='8883';

#REST版本号
softVersion='2013-12-26';

templateId = '1'
  # 发送模板短信
  # @param to 手机号码
  # @param datas 内容数据 格式为数组 例如：{'12','34'}，如不需替换请填 ''
  # @param $tempId 模板Id

def sendTemplateSMS(to, validationTxt):
    #初始化REST SDK
    rest = REST(serverIP,serverPort,softVersion)
    rest.setAccount(accountSid,accountToken)
    rest.setAppId(appId)
    result = rest.sendTemplateSMS(to,[validationTxt,'1'],templateId)

   
#sendTemplateSMS(手机号码,内容数据,模板Id)