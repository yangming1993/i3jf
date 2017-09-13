#!/usr/bin/env python
# -*- coding: utf-8 -*-

# import xadmin
#
# from .models import *
#
# from xadmin import views
#
# # 后台主题功能
# class AdminSettings(object):
#     enable_themes = True
#     use_bootswatch = True
#
# # 标题及版权修改
# class GlobalSettings(object):
#     site_title = "I3JF后台管理系统"
#     site_footer = "I3JF.COM"
# # 菜单样式设置
#     menu_style = "accordion"
#
# #添加类
# xadmin.site.register(views.BaseAdminView, AdminSettings)
# xadmin.site.register(views.CommAdminView, GlobalSettings)
#
# class AddressModelAdmin(object):
#     list_display = ["customer","telephone","contact","province_id","city_id","county_id","town_id","address_detail","is_default"]
#     search_fields = ["customer","telephone","contact","province_id","city_id","county_id","town_id","address_detail","is_default"]
#     list_filter = ["customer","telephone","contact","province_id","city_id","county_id","town_id","address_detail","is_default"]
#
# class CustomerModelAmdin(object):
#     list_display = ["auth","nickname","realname","portrait", "gender","credit_remaining"]
#     search_fields = ["auth","nickname","realname","portrait", "gender","credit_remaining"]
#     list_filter = ["auth","nickname","realname","portrait" ,"gender","credit_remaining"]
#
# class FavoutiteModelAdmin(object):
#     pass
#
# class InvoiceModelAdmin(object):
#     pass
#
# class FavouriteAdmin(object):
#     pass
#
# class OrderModelAdmin(object):
#     list_display = ["customer", "orderId", "amount", "freight", "payment", "state"]
#     search_fields = ["customer", "orderId", "amount", "freight", "payment", "state"]
#     list_filter = ["customer", "orderId", "amount", "freight", "payment", "state"]
#
# class ProductMiniModelAdmin(object):
#     pass
#
# class CartModelAdmin(object):
#     list_display = ["customer", "product", "amount"]
#     list_filter = ["customer", "product","amount"]
#
# class TraceModelAdmin(object):
#     list_display = ["customer","product","date"]
#     list_filter = ["customer","product"]
#     # readonly_fields = ["date"]  # 只读字段
#     # list_per_page = 20  # 设置分页，每页显示多少条
#
# xadmin.site.register(AddressModel, AddressModelAdmin)
# xadmin.site.register(CustomerModel, CustomerModelAmdin)
# xadmin.site.register(FavouriteModel, FavoutiteModelAdmin)
# xadmin.site.register(InvoiceModel, InvoiceModelAdmin)
# xadmin.site.register(Favourite, FavouriteAdmin)
# xadmin.site.register(OrderModel, OrderModelAdmin)
# xadmin.site.register(ProductMiniModel, ProductMiniModelAdmin)
# xadmin.site.register(CartModel, CartModelAdmin)
# xadmin.site.register(TraceModel, TraceModelAdmin)