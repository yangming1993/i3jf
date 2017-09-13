#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models
import uuid
from utils.misc import *
Redirect_Type_Choices =(
    (0, 'Keyword'),
    (1, 'Url')
)

class HomePageCircleModel(models.Model):
    # image = models.ImageField(upload_to=GetHomePageCircle, null=True,)
    image = models.ImageField(upload_to=GetCategoryImageUpload, null=True,verbose_name='图片')
    redirect_type = models.IntegerField( default = 0,choices=Redirect_Type_Choices ,verbose_name='类型')
    backend_image = models.ImageField(upload_to=GetCategoryImageUpload,verbose_name="背景图片",null=True,blank=True)
    content = models.CharField( max_length=500, default='',verbose_name='内容')
    priority = models.IntegerField(default=0, verbose_name='优先权')
    is_default = models.BooleanField(default=False, verbose_name='是否显示')

    class Meta:
        verbose_name = u"轮播图"
        verbose_name_plural = verbose_name
#class ChannelModel(models.Model):

class MiscModel(models.Model):
    key = models.CharField( max_length=500, default='')
    value = models.CharField( max_length=500, default='')
# Create your models here.
