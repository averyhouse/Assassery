from django.conf.urls import include, url
from .api import MessengerAPI

urlpatterns = [
    url("api/", MessengerAPI.as_view())
]
