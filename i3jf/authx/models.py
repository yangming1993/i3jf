#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models
from product.models import *
from django.contrib.auth.models import User

OrderState_Choice=(
    (0, 'Success'),
    (1, 'Nopay'),
    (2, 'Nosend'),
    (3, 'CancelPending'),
    (4, 'Canceled'),
    (5, 'PendingApproval'),

)
Invoice_Type_Choice =(
    (0, 'NoInvoice'),
    (1, 'WantInvoice')
)
Gender_Choices = (
    (0, 'Male'),
    (1, 'Female'),
    (2, 'Secrecy'),
)
CancelState_Choice=(
    (0, 'Normal'),
    (1, 'Canceled'),
    (2, 'FacprodConfirm')
)

class AddressModel( models.Model):
    customer = models.ForeignKey( 'CustomerModel', related_name='address_list',verbose_name='收货人')
    telephone = models.CharField( max_length=30,default='',verbose_name='手机号')
    contact = models.CharField(max_length=30,default='',verbose_name='固定电话')
    province_id = models.CharField(max_length=30,default='',verbose_name='省ID')
    city_id = models.CharField(max_length=30,default='',verbose_name='市ID')
    county_id = models.CharField(max_length=30,default='',verbose_name='县ID')
    town_id = models.CharField(max_length=30,default='',verbose_name='乡镇ID')
    address_detail = models.CharField(max_length=200,default='',verbose_name='详细地址')
    name = models.CharField(max_length=30,default='',verbose_name='地址别名')
    is_default = models.BooleanField( default= False,verbose_name='默认地址')

    class Meta:
        verbose_name = u"地址列表"
        verbose_name_plural = verbose_name



class CustomerModel( models.Model):
    auth = models.OneToOneField( User, null= True, related_name='customer')
    phone = models.CharField(max_length=32,null=True,default=None)
    nickname = models.CharField( max_length= 50, null=False,default='',verbose_name='别名')
    realname = models.CharField(max_length=100, null=False,verbose_name='真实姓名')
    portrait = models.ImageField( upload_to=GetPortraitName,verbose_name='头像')
    pay_password = models.CharField(max_length=100, null=False,verbose_name='支付密码')
    date_created = models.DateTimeField( default=timezone.now,verbose_name='注册时间')
    gender = models.IntegerField(default=0, choices=Gender_Choices,verbose_name='性别')
    credit_remaining = models.DecimalField(default=0,max_digits=11, decimal_places=2,verbose_name='积分余额')
    email = models.EmailField(null=True,verbose_name='邮箱地址')
    state = models.BooleanField(default=True,verbose_name="用户状态")
    class Meta:
        verbose_name = u"用户信息"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.realname


class FavouriteModel( models.Model ):
    customer = models.ForeignKey('CustomerModel', related_name='my_favourite_list')
    product = models.ForeignKey( 'product.ProductModel', related_name='be_favourited_list' )
    date_created = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = u"关注列表"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.product.name


class InvoiceModel( models.Model):
    customer = models.ForeignKey('CustomerModel', related_name='invoice_list')
    company_name = models.CharField( max_length=200 ,verbose_name="发票开头")
    type =  models.IntegerField( default=0, choices=Invoice_Type_Choice,verbose_name='是否要开发票')
    content = models.IntegerField(default=0 )

    class Meta:
        verbose_name = u"发票信息"
        verbose_name_plural = verbose_name

class Favourite( models.Model):
    customer = models.ForeignKey('CustomerModel', related_name='favourite_list')
    sku = models.CharField(max_length=50, null=False)
    date_created = models.DateTimeField(default=timezone.now)

class ProductMiniModel(models.Model):
    order = models.ForeignKey('OrderModel', related_name='product_bought_list', null= True)
    skuid = models.CharField( max_length=100 )
    num = models.IntegerField( default=0)
    price = models.DecimalField( default=0,max_digits=11, decimal_places=2)
    orderItemId = models.CharField(max_length=32,verbose_name="订单行号")
    arriveData = models.CharField(max_length=256,null=True)
    cancel_state = models.IntegerField( default= 0, choices=CancelState_Choice)
    class Meta:
        verbose_name = u"子订单信息"
        verbose_name_plural = verbose_name

class OrderModel( models.Model):
    customer = models.ForeignKey( 'CustomerModel', related_name='buy_order_list')
    orderId = models.CharField( max_length=100,verbose_name='订单号')
    remark = models.CharField( max_length=200 ,verbose_name='备注（少于100字）')
    invoice = models.ForeignKey( InvoiceModel, null = True,verbose_name='发货单')
    amount = models.DecimalField(default=0,max_digits=11, decimal_places=2,verbose_name='订单金额' )
    freight = models.DecimalField(default=0,max_digits=11, decimal_places=2,verbose_name='运费')
    payment = models.CharField( max_length=200,verbose_name='支付方式' )
    state = models.IntegerField(default=1, choices=OrderState_Choice,verbose_name='订单状态')
    # date_created = models.DateTimeField( default=timezone.now,verbose_name='订单创建时间')
    date_created = models.CharField(max_length=128,default=timezone.now)
    name = models.CharField(max_length=32,null=True,default=None)
    telephone = models.CharField(max_length=32,null=True,default=None)
    address = models.CharField(max_length=256,null=True,default=None)

    class Meta:
        verbose_name = u"订单信息"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.orderId

class CartModel( models.Model):
    customer = models.ForeignKey('CustomerModel', related_name='my_cart_list')
    product = models.ForeignKey('product.ProductModel', related_name='in_cart_list')
    amount = models.IntegerField(default=0,null=True)
    date_created = models.CharField(max_length=128, default=timezone.now)

    class Meta:
        verbose_name = u"购物车"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.product.name

class TraceModel( models.Model):
    customer = models.ForeignKey('CustomerModel', related_name='my_trace_list')
    product = models.ForeignKey('product.ProductModel')
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = u"浏览记录"
        verbose_name_plural = verbose_name

# Create your models here.
