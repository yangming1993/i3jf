#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models

class ProvinceModel(models.Model):
    name = models.CharField( max_length= 100, null= False, default='')
    # code =  models.CharField( max_length= 50, null= False, default='')
    level = models.CharField(max_length=20,null=True)
    pId = models.CharField(max_length=20,null=True)
    nid = models.CharField(max_length=20,null=True)
    snid = models.CharField(max_length=20,null=True)

    class Meta:
        verbose_name = u"省"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class CityModel(models.Model):
    # province = models.ForeignKey( ProvinceModel, related_name='city_list')
    # name = models.CharField(max_length=100, null=False, default='')
    # code = models.CharField(max_length=50, null=False, default='')

    name = models.CharField(max_length=100, null=False, default='')
    level = models.CharField(max_length=20, null=True)
    pId = models.CharField(max_length=20, null=True)
    nid = models.CharField(max_length=20, null=True)
    snid = models.CharField(max_length=20, null=True)

    class Meta:
        verbose_name = u"市/区"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class DistrictModel(models.Model):
    # city = models.ForeignKey(CityModel, related_name='district_list')
    # name = models.CharField(max_length=100, null=False, default='')
    # code = models.CharField(max_length=50, null=False, default='')

    name = models.CharField(max_length=100, null=True, default='')
    level = models.CharField(max_length=20, null=True)
    pId = models.CharField(max_length=20, null=True)
    nid = models.CharField(max_length=20, null=True)
    snid = models.CharField(max_length=20, null=True)

    class Meta:
        verbose_name = u"县"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class TownModel(models.Model):
    # district = models.ForeignKey(DistrictModel, related_name='town_list')
    # name = models.CharField(max_length=100, null=False, default='')
    # code = models.CharField(max_length=50, null=False, default='')

    name = models.CharField(max_length=100, null=False, default='')
    level = models.CharField(max_length=20, null=True)
    pId = models.CharField(max_length=20, null=True)
    nid = models.CharField(max_length=20, null=True)
    secondPid = models.CharField(max_length=20,null=True)
    snid = models.CharField(max_length=20, null=True)


    class Meta:
        verbose_name = u"乡/镇"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name
# Create your models here.
