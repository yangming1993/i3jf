"""i3jf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from authx import views
#import xadmin
# xadmin.autodiscover()
# from xadmin.plugins import xversion
from settings import MEDIA_ROOT
from django.views.static import serve
# xversion.register_models()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # url(r'xadmin/', include(xadmin.site.urls)),
    url(r'^$',views.index ),
    url(r'^helper$',views.helper ),
    url(r'^helper_content$',views.helper_content ),
    url(r'^api/captcha/', include('captcha.urls')),
    url(r'^api/user/', include('authx.urls')),
    url(r'^api/recharge/', include('recharge.urls')),
    url(r'^api/product/', include('product.urls')),
    url(r'^api/area/', include('area.urls')),
    url(r'^api/main/', include('main.urls')),
    url(r'^upload/(?P<path>.*)$', serve,{'document_root':MEDIA_ROOT}),
    url(r'^api/order/', include('order.urls')),
    url(r'^api/oam/', include('oam.urls')),
]
