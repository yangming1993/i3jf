# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-21 03:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authx', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customermodel',
            name='state',
            field=models.BooleanField(default=True, verbose_name='\u7528\u6237\u72b6\u6001'),
        ),
    ]
