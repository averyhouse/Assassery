from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AssassinSerializer
from .models import Assassin

class AssassinView(viewsets.ModelViewSet):
    serializer_class = AssassinSerializer
    queryset = Assassin.objects.all()
