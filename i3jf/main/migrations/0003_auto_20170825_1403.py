# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-25 06:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_homepagecirclemodel_backend_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepagecirclemodel',
            name='backend_image',
            field=models.ImageField(default=None, upload_to=b'', verbose_name='\u80cc\u666f\u56fe\u7247'),
        ),
    ]