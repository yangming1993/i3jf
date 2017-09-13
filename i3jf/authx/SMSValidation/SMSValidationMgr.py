from django.utils import timezone
from i3jf.settings import DEFAULT_SMS_VALIDATION_DEBUG_CODE_MAX, DEFAULT_SMS_VALIDATION_EXPIRE_IN_SEC
from django.utils.dateparse import *
class SMSValidationMgr:
    _ValidationSet = {}
    _PendingValidationSet = {}

    def AddValidation(self, req, key, validationCode ):
        req.session[key] = [validationCode, str(timezone.now()), False]

    def ValidationAvailable( self, req, key ):
        if req.session._session.has_key(key):
            validation_data = req.session[key]
            secs = (timezone.now() - parse_datetime( validation_data[1])).seconds
            if secs < DEFAULT_SMS_VALIDATION_EXPIRE_IN_SEC:
                return validation_data[0]
            else:
                del req.session[key]
        return ''

    def GetValidationCode( self, req, key ):
        if req.session._session.has_key(key):
            return req.session[key][0]
        return ''

    def MoveToPendingValidation( self, req, key ):
        req.session[key][2] = True
        req.session.modified = True

    def IsValidated( self, req, key ):
        return req.session._session.has_key(key) and req.session[key][2] == True

    def RemovePendingValidation( self, req, key ):
        del req.session[key]
    def isDebugCode( self, sPhone ):
        if int(sPhone) < DEFAULT_SMS_VALIDATION_DEBUG_CODE_MAX:
            return True
        return False

gSMSValidationMgr = SMSValidationMgr()