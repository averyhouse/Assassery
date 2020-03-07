from rest_framework import serializers
from .models import Assassin
from django.contrib.auth.models import User

class AssassinSerializer(serializers.ModelSerializer):
  class Meta:
    model = Assassin
    fields = ('id', 'name', 'alias', 'team', 'target', 'dead')

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        email=validated_data['email'],
                                        password=validated_data['password'])
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')