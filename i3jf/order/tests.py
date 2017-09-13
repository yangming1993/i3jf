# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase

# Create your tests here.
import time

ISFORMAT="%Y-%m-%d %H:%M:%S"
TIMESTAMP="%Y%m%d%H%M%S"
tt = "20130729100823"
# time.strptime(tt,TIMESTAMP)
# print time.mktime(time.strptime(tt, TIMESTAMP))
print time.strftime(ISFORMAT, time.strptime(tt, TIMESTAMP))