from django.conf.urls import include, url
from django.contrib import admin
from authx.views import *

urlpatterns = [
    url(r'^check_mobile/$', check_mobile_view),
    url(r'^get_captcha/$', get_captcha_view),
    url(r'^check_captcha/$', check_captcha_view),
    url(r'^send_verification_code/$', send_verification_code_view),
    url(r'^check_verification_code/$', check_verification_code_view),

    url(r'^login/$',login),
    url(r'^register/$', register),

    url(r'^register_view/$', register_view),
    url(r'^login_view/$', login_view),
    url(r'^logout/$', logout_view),

    url(r'^forgetpassword/$', forgetpassword),
    url(r'^password/set', password_set),
    url(r'^password/change', password_change_view),

    url(r'^address/list', address_list_view),
    url(r'^address/remove/', address_remove_view),
    url(r'^address/create/', address_create_view),#post
    url(r'^address/update/', address_update_view),
    url(r'^address/set_default/', address_set_default_view),

    url(r'^center$',personalCenter),
    url(r'^center/point/inquire$',Point_inquire),
    url(r'^recharge/hebao$',recharge),
    url(r'^recharge$',order_recharge),

    url(r'^update$', update_profile_view),
    url(r'^retrieve/$', retrieve_profile_view),

    url(r'^forget_password/get_verification_code/$', forget_password_get_verification_code_view),
    url(r'^forget_password/check_verification_code/$', forget_password_check_verification_code_view),
    url(r'^forget_password$', forget_password_view),
    url(r'^change_telephone/get_verification_code_for_new/$', change_telephone_get_verification_code_for_new_view),
    url(r'^change_telephone/check_verification_code_for_new/$', change_telephone_check_verification_code_for_new_view),
    url(r'^change_telephone/get_verification_code_for_old/$', change_telephone_get_verification_code_for_old_view),
    url(r'^change_telephone/check_verification_code_for_old/$', change_telephone_check_verification_code_for_old_view),
    url(r'^change_telephone/$', change_telephone_view),
    url(r'^pay_password/get_verification_code/$', pay_password_get_verification_code_view),
    url(r'^pay_password/check_verification_code/$', pay_password_check_verification_code_view),

    url(r'^phone$', phone),

    url(r'^pay/password/set$', set_pay_password),
    url(r'^pay/password/change$', change_pay_password),

    url(r'^pay_password/$', pay_password_view),
    url(r'^get_credit/$', get_credit_view),

    url(r'^follow$',my_follow),

    url(r'^favourite/create/$', create_favourite_view),
    url(r'^favourite/remove/$', remove_favourite_view),
    url(r'^favourite/list/$', list_favourite_view),

    url(r'^mycart$', mycart),

    url(r'^cart/create/$', create_cart_view),
    url(r'^cart/list/$', list_cart_view),
    url(r'^cart/update/$', update_cart_view),
    url(r'^cart/batch_remove/$', batch_remove_cart_view),
    url(r'^cart/amount/$', get_cart_amount),

    url(r'^trace$', trace),

    url(r'^trace/create/$', create_trace),
    url(r'^trace/list/$', list_trace_view),


    url(r'^recharge/create/$', create_recharge_view),
    url(r'^recharge/diff/$', diff_recharge_view),













    # url(r'^password_reset/$', password_reset_view),
]
