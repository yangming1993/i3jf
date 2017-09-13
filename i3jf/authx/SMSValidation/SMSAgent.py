from authx.SMSValidation.YunTongXun.SendTemplateSMS import sendTemplateSMS
from authx.SMSValidation.CamsingSMS.SendTemplateSMS import sendTemplateSMS as sendTemplateSMS_Camsing
from authx.SMSValidation.AliDayu.SendTemplateSMS import sendSMSTemplate as sendTemplateSMS_AliDayu
#import nexmo
#from WhereYoSrv.settings import FOR_OVERSEA, NEXMO_KEY, NEXMO_SECRET, NEXMO_SENDERID, MAXMIND_GEOIP_DB_PATH
#import geoip2.database
class SMSAgent:
    def __init__(self, service_name):
        self.service_name = service_name
    def sendSMS(self, ip, phone, number, template_id):
        phoneToSend = phone
        if self.service_name == "camsing":
            sendTemplateSMS(phoneToSend, number, template_id)
        elif self.service_name == "yuntongxun":
            sendTemplateSMS_Camsing( phoneToSend, number, template_id)
        elif self.service_name == "alidayu":
            sendTemplateSMS_AliDayu( phoneToSend, number, template_id)
        else:
            pass
GSMSAgent = SMSAgent('alidayu')
def sendSMS( ip, phone, number, template_id ):
    GSMSAgent.sendSMS( ip, phone, number, template_id)
