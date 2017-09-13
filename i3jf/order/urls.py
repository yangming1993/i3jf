# -*- coding: utf-8 -*-

from django.conf.urls import include, url
from django.contrib import admin
from .views import *
from views import *

urlpatterns = [
    url(r'^$',order_list),

    url(r'^confirm',order_confirm),
    url(r'^submit',order_submit),
    url(r'^pay',order_pay),
    url(r'^detail',order_detail),

    url(r'^get_ship_carriage$',get_ship_carriage),
    url(r'^create/$',order_create),
    url( '^rejectorder/', reject_order),
    url( '^cancelorder/', cancel_order),

    url( '^logistics/', get_order_logistics), #获取物流信息

    url(r'^check/score$',check_score),
    url(r'^list_all$',get_all_order_list),
    url(r'^list_unpay$',get_all_order_unpay_list),
    url(r'^list_unsend$',get_all_order_unsend_list),
    url(r'^list_canceled$',get_all_order_canceled_list),

    url(r'^retrieve$',get_order_retrieve),

    url(r'^refund/$',refund_order),
    url(r'^remove/$',remove_order),

]
