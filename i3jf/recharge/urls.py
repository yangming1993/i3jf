from django.conf.urls import url, include
from django.contrib import admin
from .views import *
urlpatterns = [
    url(r'^create', create_recharge_view),
    url(r'^diff', order_diff_view),
    url(r'^check_state', check_recharge_state_view),
]
