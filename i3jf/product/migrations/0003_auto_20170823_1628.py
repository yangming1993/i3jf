# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-23 08:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_auto_20170816_1446'),
    ]

    operations = [
        migrations.AddField(
            model_name='productmodel',
            name='close_price',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=11, null=True, verbose_name='\u7ed3\u7b97\u4ef7\u683c'),
        ),
        migrations.AddField(
            model_name='productmodel',
            name='float_price',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=11, null=True, verbose_name='\u6d6e\u52a8\u4ef7\u683c'),
        ),
        migrations.AddField(
            model_name='productmodel',
            name='online_price',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=11, null=True, verbose_name='\u4e0a\u7ebf\u4ef7\u683c'),
        ),
    ]
