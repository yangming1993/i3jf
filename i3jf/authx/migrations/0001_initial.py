# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-16 06:30
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import product.misc


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('product', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AddressModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('telephone', models.CharField(default='', max_length=30, verbose_name='\u624b\u673a\u53f7')),
                ('contact', models.CharField(default='', max_length=30, verbose_name='\u56fa\u5b9a\u7535\u8bdd')),
                ('province_id', models.CharField(default='', max_length=30, verbose_name='\u7701ID')),
                ('city_id', models.CharField(default='', max_length=30, verbose_name='\u5e02ID')),
                ('county_id', models.CharField(default='', max_length=30, verbose_name='\u53bfID')),
                ('town_id', models.CharField(default='', max_length=30, verbose_name='\u4e61\u9547ID')),
                ('address_detail', models.CharField(default='', max_length=200, verbose_name='\u8be6\u7ec6\u5730\u5740')),
                ('name', models.CharField(default='', max_length=30, verbose_name='\u5730\u5740\u522b\u540d')),
                ('is_default', models.BooleanField(default=False, verbose_name='\u9ed8\u8ba4\u5730\u5740')),
            ],
            options={
                'verbose_name': '\u5730\u5740\u5217\u8868',
                'verbose_name_plural': '\u5730\u5740\u5217\u8868',
            },
        ),
        migrations.CreateModel(
            name='CartModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=0, null=True)),
                ('date_created', models.CharField(default=django.utils.timezone.now, max_length=128)),
            ],
            options={
                'verbose_name': '\u8d2d\u7269\u8f66',
                'verbose_name_plural': '\u8d2d\u7269\u8f66',
            },
        ),
        migrations.CreateModel(
            name='CustomerModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(default='', max_length=50, verbose_name='\u522b\u540d')),
                ('realname', models.CharField(max_length=100, verbose_name='\u771f\u5b9e\u59d3\u540d')),
                ('portrait', models.ImageField(upload_to=product.misc.GetPortraitName, verbose_name='\u5934\u50cf')),
                ('pay_password', models.CharField(max_length=100, verbose_name='\u652f\u4ed8\u5bc6\u7801')),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now, verbose_name='\u6ce8\u518c\u65f6\u95f4')),
                ('gender', models.IntegerField(choices=[(0, 'Male'), (1, 'Female')], default=0, verbose_name='\u6027\u522b')),
                ('credit_remaining', models.DecimalField(decimal_places=2, default=0, max_digits=11, verbose_name='\u79ef\u5206\u4f59\u989d')),
                ('email', models.EmailField(max_length=254, null=True, verbose_name='\u90ae\u7bb1\u5730\u5740')),
                ('auth', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customer', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': '\u7528\u6237\u4fe1\u606f',
                'verbose_name_plural': '\u7528\u6237\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='Favourite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sku', models.CharField(max_length=50)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favourite_list', to='authx.CustomerModel')),
            ],
        ),
        migrations.CreateModel(
            name='FavouriteModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='my_favourite_list', to='authx.CustomerModel')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='be_favourited_list', to='product.ProductModel')),
            ],
            options={
                'verbose_name': '\u5173\u6ce8\u5217\u8868',
                'verbose_name_plural': '\u5173\u6ce8\u5217\u8868',
            },
        ),
        migrations.CreateModel(
            name='InvoiceModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=200, verbose_name='\u53d1\u7968\u5f00\u5934')),
                ('type', models.IntegerField(choices=[(0, 'NoInvoice'), (1, 'WantInvoice')], default=0, verbose_name='\u662f\u5426\u8981\u5f00\u53d1\u7968')),
                ('content', models.IntegerField(default=0)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoice_list', to='authx.CustomerModel')),
            ],
            options={
                'verbose_name': '\u53d1\u7968\u4fe1\u606f',
                'verbose_name_plural': '\u53d1\u7968\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='OrderModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('orderId', models.CharField(max_length=100, verbose_name='\u8ba2\u5355\u53f7')),
                ('remark', models.CharField(max_length=200, verbose_name='\u5907\u6ce8\uff08\u5c11\u4e8e100\u5b57\uff09')),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=11, verbose_name='\u8ba2\u5355\u91d1\u989d')),
                ('freight', models.DecimalField(decimal_places=2, default=0, max_digits=11, verbose_name='\u8fd0\u8d39')),
                ('payment', models.CharField(max_length=200, verbose_name='\u652f\u4ed8\u65b9\u5f0f')),
                ('state', models.IntegerField(choices=[(0, 'Success'), (1, 'Nopay'), (2, 'Nosend'), (3, 'CancelPending'), (4, 'Canceled'), (5, 'PendingApproval')], default=1, verbose_name='\u8ba2\u5355\u72b6\u6001')),
                ('date_created', models.CharField(default=django.utils.timezone.now, max_length=128)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='buy_order_list', to='authx.CustomerModel')),
                ('invoice', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='authx.InvoiceModel', verbose_name='\u53d1\u8d27\u5355')),
            ],
            options={
                'verbose_name': '\u8ba2\u5355\u4fe1\u606f',
                'verbose_name_plural': '\u8ba2\u5355\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='ProductMiniModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skuid', models.CharField(max_length=100)),
                ('num', models.IntegerField(default=0)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=11)),
                ('orderItemId', models.CharField(max_length=32, verbose_name='\u8ba2\u5355\u884c\u53f7')),
                ('arriveData', models.CharField(max_length=256, null=True)),
                ('cancel_state', models.IntegerField(choices=[(0, 'Normal'), (1, 'Canceled'), (2, 'FacprodConfirm')], default=0)),
                ('order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='product_bought_list', to='authx.OrderModel')),
            ],
            options={
                'verbose_name': '\u5b50\u8ba2\u5355\u4fe1\u606f',
                'verbose_name_plural': '\u5b50\u8ba2\u5355\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='TraceModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='my_trace_list', to='authx.CustomerModel')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.ProductModel')),
            ],
            options={
                'verbose_name': '\u6d4f\u89c8\u8bb0\u5f55',
                'verbose_name_plural': '\u6d4f\u89c8\u8bb0\u5f55',
            },
        ),
        migrations.AddField(
            model_name='cartmodel',
            name='customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='my_cart_list', to='authx.CustomerModel'),
        ),
        migrations.AddField(
            model_name='cartmodel',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='in_cart_list', to='product.ProductModel'),
        ),
        migrations.AddField(
            model_name='addressmodel',
            name='customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='address_list', to='authx.CustomerModel', verbose_name='\u6536\u8d27\u4eba'),
        ),
    ]
