#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.contrib import admin

# Register your models here.
from django.contrib import admin
from authx.models import *

class CustomerInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'source', 'contact_type', 'contact', 'consultant', 'status', 'date']
    list_filter = ['source', 'consultant', 'status', 'date']
    search_fields = ['contact', 'consultant__name']
    readonly_fields = ['status','contact']   # 只读字段
    filter_horizontal = ['consult_courses',]  # 出现炫酷的select切换
    list_per_page = 2    # 设置分页，每页显示多少条

admin.site.register(CustomerModel)