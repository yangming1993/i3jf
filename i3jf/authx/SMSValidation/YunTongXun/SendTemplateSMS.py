#coding=gbk

#coding=utf-8

#-*- coding: UTF-8 -*-  

from CCPRestSDK import REST
import ConfigParser

#���ʺ�
accountSid= 'aaf98f8951d8d1c10151e7903d6d32fc';

#���ʺ�Token
accountToken= '684d70c6642f40edaa7337a2354911e4';

#Ӧ��Id
appId='8a48b55151e720740151e79197700151';

#�����ַ����ʽ���£�����Ҫдhttp://
serverIP='sandboxapp.cloopen.com';

#����˿� 
serverPort='8883';

#REST�汾��
softVersion='2013-12-26';

templateId = '1'
  # ����ģ�����
  # @param to �ֻ�����
  # @param datas �������� ��ʽΪ���� ���磺{'12','34'}���粻���滻���� ''
  # @param $tempId ģ��Id

def sendTemplateSMS(to, validationTxt):
    #��ʼ��REST SDK
    rest = REST(serverIP,serverPort,softVersion)
    rest.setAccount(accountSid,accountToken)
    rest.setAppId(appId)
    result = rest.sendTemplateSMS(to,[validationTxt,'1'],templateId)

   
#sendTemplateSMS(�ֻ�����,��������,ģ��Id)