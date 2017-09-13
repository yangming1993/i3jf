from django import forms
from captcha.fields import CaptchaField
from django.utils.translation import ugettext_lazy as _

class RegisterForm(forms.Form):
    mobile = forms.CharField()
    password = forms.CharField()

class LoginForm(forms.Form):
    mobile = forms.CharField()
    password = forms.CharField()
