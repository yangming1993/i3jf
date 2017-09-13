#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models
Recharge_State_Choices = (
    (0, 'Normal'),
    (1, 'Abnormal'),
)
# Create your models here.

class RechargeModel(models.Model):
    order_id = models.CharField(max_length=128, default='',verbose_name='商户订单号')
    customer = models.ForeignKey( 'authx.CustomerModel', related_name='my_recharge_list', null=True,verbose_name='充值用户')
    payno = models.CharField( max_length= 128, default= '',verbose_name='流水号')
    state = models.IntegerField( default= 0, choices= Recharge_State_Choices,verbose_name='状态')
    amount = models.DecimalField(default=0, max_digits=11, decimal_places=2,verbose_name='支付金额')
    return_code = models.CharField( max_length= 10, default= '',verbose_name='返回码')
    message = models.CharField( max_length= 10, default= '',verbose_name='返回码描述信息')
    type = models.CharField( max_length= 10, default= '',verbose_name='接口类型')
    amt_item = models.CharField( max_length= 10, default= '',verbose_name='金额明细')
    bank_abbr = models.CharField( max_length= 10, default= '',verbose_name='支付银行')
    mobile = models.CharField( max_length= 10, default= '',verbose_name='支付手机号')
    pay_date = models.CharField( max_length= 10, default= '',verbose_name='支付时间')
    account_date = models.CharField( max_length= 10, default= '',verbose_name='会计时间')
    status = models.CharField( max_length= 10, default='',verbose_name='支付结果')
    order_date = models.CharField(max_length= 10, default='',verbose_name='订单提交日期')
    fee = models.DecimalField(default=0, max_digits=11, decimal_places=2,verbose_name='费用')

    class Meta:
        verbose_name = u"充值信息"
        verbose_name_plural = verbose_name