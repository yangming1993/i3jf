from django.conf.urls import include, url
from django.contrib import admin
from .views import *

urlpatterns = [
    url(r'^get_ip/$',getIp),
    url(r'^search/$',search_product),
    url(r'^detail/$',product_detail),
    url(r'^get_detail/$', get_product_detail_view),
    url(r'^get_stock/$', get_product_stock_view),
    url(r'^batch_get_stock/$', batch_get_product_stock_view),
    url(r'^get_image/$', get_product_image_view),
    url(r'^search_product/$', search_product_view),
    url(r'^get_credit/$', get_credit_view),
    url(r'^batch_query_price/$', batch_query_price_view),

    url(r'^get_all_product/$', get_all_product_view),
    url(r'^get_categroy1_product/$', get_categroy1_product_view),
    url(r'^get_categroy2_product/$', get_categroy2_product_view),
    url(r'^get_getcategory_detail/$', get_getcategory_detail),



    # url(r'^getcategory/$', get_product_getcategory),


]
