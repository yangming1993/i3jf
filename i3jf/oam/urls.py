
from django.conf.urls import include, url
from django.contrib import admin
from views import *

urlpatterns = [

    url(r'^data_analysis/$', data_analysis),
    url(r'^admin/login$', login),
    url(r'^user/lists$', userList),
    url(r'^order/lists$', orderList),
    url(r'^order/detail$', orderDetail),
    url(r'^returned/history$', history),
    url(r'^price/set$', priceSet),
    url(r'^product/lists$', productLists),
    url(r'^banner/ads/list$', backendLoop),
    url(r'^channel/product/lists$', channelProductList),
    url(r'^get/product/detail$', getPorductDetail),
    url(r'^get/area/detail$', getAreaDetail),
    url(r'^channel/detail$', channelDetal),


    url(r'^get_product_category/$', get_product_category),
    url(r'^get_getcategory_info/$', get_getcategory_info),
    url(r'^get_product_info/$', get_product_info),
    url(r'^get_product_image/$', get_product_image_backend),
    url(r'^get_product_price/$', get_product_price_backend),
    url(r'^get_product_stock/$', get_product_stock_backend),

    url(r'^area/province/$', province),
    url(r'^area/city/$', city),
    url(r'^area/country/$', country),
    url(r'^area/town/$', town),

    url(r'^user/login$',login_backend),
    url(r'^user/password/change$', password_change_view),
    url(r'^user/get_captcha$',get_captcha_backend),
    url(r'^user/logout$',logout_backend),
    url(r'^user/list$',user_list),
    url(r'^user/disable_enable_user$',disable_enable_user),
    url(r'^user/recharge$',recharge),

    url(r'^order/all$',order_all),
    url(r'^order/statelist$',get_order_state),
    url(r'^order/orderdetails$',get_order_details),
    url(r'^order/ordercancels$',get_order_cancel),

    url(r'^product/list$',get_product_list),
    url(r'^product/list_text$',get_product_list_text),
    url(r'^product/set$',product_set),
    url(r'^product/delete$',product_delete),

    url(r'^product/categroy1_list$',get_categroy1),
    url(r'^product/categroy2_list$',get_categroy2),
    url(r'^product/categroy3_list$',get_categroy3),

    url(r'^product/categroy1_delete',category1_delete),

    url(r'^product/price/list$',get_product_price),
    url(r'^product/price/set$',product_price_set),
    url(r'^product/price/delete$',product_price_delete),
    url(r'^product/price/add$',product_price_add),

    url(r'^main/list$',main_list),
    url(r'^main/add$',main_add),
    url(r'^main/set$',main_set),
    url(r'^main/delete$',main_delete),
    url(r'^main/up_or_down',main_stant_up_down),

    url(r'^main/channel/list$',main_channel_list),
    url(r'^main/channel/add$',main_channel_add),
    url(r'^main/channel/set$',main_channel_set),
    url(r'^main/channel/up$',main_channel_up),
    url(r'^main/channel/down$',main_channel_down),
    url(r'^main/channel/delete$',main_channel_delete),

    url(r'^main/channel/watch$',main_channel_watch),
    url(r'^main/channel/add_product$',channel_product_add),
    url(r'^main/channel/delete_product$',channel_product_delete),
    url(r'^main/channel/set_product_hot$',set_product_hot),
    url(r'^main/channel/set_image_big$',set_product_image_big),

    url(r'^count_order$',count_order),
    url(r'^count_order_state$',count_order_state),
    url(r'^count_trace$',count_trace),

]




