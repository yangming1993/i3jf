
from django.conf.urls import include, url
from django.contrib import admin
from .views import *

urlpatterns = [
    url(r'^province/list/$', list_province_view),
    url(r'^city/list/$', list_city_view),
    url(r'^district/list/$', list_district_view),
    url(r'^town/list/$', list_town_view),
    url(r'^fulladdress$', fulladdress),
]




