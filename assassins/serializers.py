from rest_framework import serializers
from .models import Assassin, User, KillFeed
from django.contrib.auth import authenticate, settings
import re

caltech_email = re.compile("[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@caltech.edu")

class AssassinSerializer(serializers.ModelSerializer):
  class Meta:
    model = Assassin
    fields = ('dead', )

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'username', 'password', 'email') # 'messenger', 'photo')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if not re.fullmatch(caltech_email, value):
            raise serializers.ValidationError("Please input a Caltech email.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(name=validated_data['name'], 
                                        username=validated_data['username'],
                                        email=validated_data['email'],
                                        password=validated_data['password'], # messenger=validated_data['messenger'],photo=validated_data['photo']
                                        )
        return user

class LoginUserSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate_email(self, value):
        if not re.fullmatch(caltech_email, value):
            raise serializers.ValidationError("Please input a Caltech email.")
        return value

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')

class KillSerializer(serializers.ModelSerializer):
    class Meta:
        model = KillFeed
        fields = ('killer_username', 'victim_username', 'message', 'timestamp', 'confirmed')

