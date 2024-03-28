from django.urls import path
from .views import *

urlpatterns = [path("currency", get_current_rates)]
