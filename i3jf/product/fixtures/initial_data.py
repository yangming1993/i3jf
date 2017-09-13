from dynamic_initial_data.base import BaseInitialData
from product.models import *
import json

class InitialData(BaseInitialData):
    #dependencies = ['suning']

    def update_initial_data(self):
        with open('category.json','r') as f:
            str = f.read()
            j = json.loads(str)
            for first_category in j:
                print first_category
#        ChannelModel.objects.bulk_create([
#            ChannelModel( casual_name = 'sn' ),
#            ChannelModel(casual_name='jd'),])