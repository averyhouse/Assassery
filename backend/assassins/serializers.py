from rest_framework import serializers
from .models import Assassin, User, KillFeed
from django.contrib.auth import authenticate, settings

class AssassinSerializer(serializers.ModelSerializer):
  class Meta:
    model = Assassin
    fields = ('id', 'name', 'alias', 'team', 'target', 'dead')

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'messenger')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'],
                                        password=validated_data['password'], messenger=validated_data['messenger'])
        return user

class LoginUserSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class KillSerializer(serializers.ModelSerializer):
    class Meta:
        model = KillFeed
        fields = ('killerID', 'killedID', 'message', 'timeStamp')

