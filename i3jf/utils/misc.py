import uuid
import json

def make_failed_msg( msg ):
    r = dict()
    r['errno'] = 1
    r['errmsg'] = msg
    return json.dumps(r)


def GetCategoryImageUpload(instance, filename):
    return str(uuid.uuid1())