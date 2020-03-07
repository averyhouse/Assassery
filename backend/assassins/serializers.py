from rest_framework import serializers
from .models import Assassin

class AssassinSerializer(serializers.ModelSerializer):
  class Meta:
    model = Assassin
    fields = ('id', 'name', 'alias', 'team', 'target', 'dead')