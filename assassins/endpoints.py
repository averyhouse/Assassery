# from django.conf.urls import include, url
from django.urls import include
from django.urls import re_path as url
from rest_framework import routers

from .api import *

router = routers.DefaultRouter()
router.register('notes', AssassinViewSet)

urlpatterns = [
    url("", include(router.urls)),
    url("game/status/$", StatusAPI.as_view()),
    url("game/dashboard/$", DashboardAPI.as_view()),
    url("game/teamleaderboard/$", TeamLeaderboardAPI.as_view()),
    url("game/game/$", GameAPI.as_view()),
    url("game/assassin/$", AssassinAPI.as_view()),
    url("game/kill/$", KillAPI.as_view()),
    url("auth/register/$", RegistrationAPI.as_view()),
    url("auth/login/$", LoginAPI.as_view()),
    url("auth/user/$", UserAPI.as_view())
]