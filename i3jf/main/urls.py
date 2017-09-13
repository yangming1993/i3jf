from django.conf.urls import url, include
from .views import *
from django.contrib import admin
urlpatterns = [
    url(r'^list_category', list_category_view),
    url(r'^circle', circle_view),
    url(r'^list_channel', list_channel_view),
    url(r'^list_recommendation', recommendation_view),
    url(r'^list_hotsale', list_hotsale_view),
]
