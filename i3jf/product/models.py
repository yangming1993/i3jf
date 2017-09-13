#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from mptt.models import MPTTModel, TreeForeignKey
from .misc import *
from authx.models import *

Product_Source_Choice=(
    (0, 'sn'),
    (1, 'jd'),
    (2, 'self'),
)
SaleState_Choice=(
    (0, 'OffSale'),
    (1, 'OnSale'),
)
class Category1Model(models.Model):
    first = models.CharField(max_length=32, null=True, default=None)
    name = models.CharField( max_length= 50, null= True,default=None)
    # img_url = models.ImageField(upload_to=GetCategoryImageUpload, null=True)
    class Meta:
        verbose_name = u"一级分类"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class Category2Model(models.Model):
    second = models.CharField(max_length=32, null=True, default=None)
    parent = models.ForeignKey('Category1Model', related_name='category2_list',default=None)
    name = models.CharField( max_length= 50, null=True,default=None)
    class Meta:
        verbose_name = u"二级分类"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class Category3Model(models.Model):
    third = models.CharField(max_length=32,blank=True, null=True, default=None)
    parent = models.ForeignKey('Category2Model', related_name='category3_list',default=None )
    name = models.CharField(max_length=50, null=True,default=None)

    class Meta:
        verbose_name = u"三级分类"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class ProductImageModel(models.Model):
    product = models.ForeignKey( 'ProductModel', related_name='image_list',verbose_name="产品名")
    image = models.CharField(max_length=256,null=True,verbose_name='图片')
    is_default = models.BooleanField( default= False)

    class Meta:
        verbose_name = u"商品图片"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.product.name

class ProductModel(models.Model):
    sku = models.CharField( max_length= 256, null= True,verbose_name='商品编码',blank=True)
    weight = models.CharField( max_length= 256, null= True, default='',verbose_name='重量',blank=True)
    image = models.CharField(max_length=256, null=True,verbose_name='主图地址',blank=True)
    state = models.IntegerField( default= 0, choices=SaleState_Choice,verbose_name='上下架状态',blank=True)
    brand = models.CharField( max_length= 256, null= True, default='',verbose_name='品牌',blank=True)
    model = models.CharField(max_length=256, null=True, default='',verbose_name='型号',blank=True)
    name = models.CharField(max_length=256, null=True, default='',verbose_name='商品名称')
    manufacture_place = models.CharField(max_length=256, null=True, default='',verbose_name='商品产地',blank=True)
    upc = models.CharField(max_length=256, null=True, default='',verbose_name='条形码',blank=True)
    sale_unit = models.CharField(max_length=256, null=True, default='',verbose_name='销售单位',blank=True)
    introduction = models.TextField( null=True, default='',verbose_name='商品描述',blank=True)
    param = models.TextField(null=True, default='',verbose_name='参数组',blank=True)
    category_d1 = models.ForeignKey(Category1Model, related_name='category_d1', default='', null=True,verbose_name="一级分类")
    category_d2 = models.ForeignKey(Category2Model, related_name='category_d2', default='', null=True,verbose_name="二级分类")
    category = models.ForeignKey(Category3Model, related_name='product_list',null=True,verbose_name='三级分类',blank=True)
    credit_amount = models.DecimalField(default=0,max_digits=11, decimal_places=2 ,null=True,verbose_name='积分价格',blank=True)
    close_price = models.DecimalField(default=0, max_digits=11, decimal_places=2, null=True, verbose_name='结算价格',
                                      blank=True)
    online_price = models.DecimalField(default=0, max_digits=11, decimal_places=2, null=True, verbose_name='上线价格',
                                       blank=True)
    float_price = models.DecimalField(default=0, max_digits=11, decimal_places=2, null=True, verbose_name='浮动价格',
                                      blank=True)
    discount = models.DecimalField(default=0, null=True, max_digits=11, decimal_places=2, verbose_name='折扣', blank=True)
    last_sync = models.DateTimeField( default= timezone.now,verbose_name='最后一次同步时间',blank=True)
    last_change = models.DateTimeField(default= timezone.now,verbose_name="最后修改时间",blank=True)
    source = models.IntegerField( default= 0, choices=Product_Source_Choice)
    is_hot = models.BooleanField( default= False,verbose_name='是否热卖',blank=True)
    stock = models.IntegerField(default=0,null=True,blank=True,verbose_name="库存")
    is_show = models.BooleanField(default=True,verbose_name="是否显示")
    is_big = models.BooleanField(default=False,verbose_name="是否是大图")
    class Meta:
        verbose_name = u"商品详情"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class ChannelModel(models.Model):
    name = models.CharField(max_length=50, null=False, default='',verbose_name="产品频道")
    priority = models.IntegerField(default=0,verbose_name='优先权')
    product = models.ManyToManyField( 'ProductModel',related_name='channels_belong_to')
    image = models.CharField(max_length=256,null=True,blank=True)
    is_default = models.BooleanField(default=False, verbose_name='是否显示')
    categtoy = models.ForeignKey(Category1Model,default=None,null=True,blank=True)

    class Meta:
        verbose_name = u"商品频道"
        verbose_name_plural = verbose_name
    def __unicode__(self):
        return self.name
# Create your models here.

