from django.core.mail import send_mail
from django.contrib.auth import settings
from rest_framework import viewsets, permissions, generics, authentication
from rest_framework.response import Response
from knox.models import AuthToken
import knox

from .models import Assassin, User
from .serializers import AssassinSerializer, CreateUserSerializer, UserSerializer, LoginUserSerializer, KillSerializer


class AssassinViewSet(viewsets.ModelViewSet):
    queryset = Assassin.objects.all()
    permission_classes = [permissions.AllowAny, ]
    serializer_class = AssassinSerializer

# curl --request POST \
#   --url http://localhost:8000/api/auth/register/ \
#   --header 'content-type: application/json' \
#   --data '{"username": "USERNAME", "email": "EMAIL", "password": "PASSWORD" }'
class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        if 'messenger' not in request.data:
            request.data['messenger'] = None
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

# curl --request POST \
#   --url http://localhost:8000/api/auth/login/ \
#   --header 'content-type: application/json' \
#   --data '{"email": "EMAIL", "password": "PASSWORD" }'
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

# curl --request GET \
#   --url http://localhost:8000/api/auth/user/ \
#   --header 'authorization: Token TOKEN' \
#   --header 'content-type: application/json' \
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class KillAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = KillSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        kill = serializer.validated_data
        if request.user.id == kill['killerID']:
            getModel(request.user.id).kill(kill['killedID'])
            return Response({'result': 'success'})
        return Response({'result': 'failure'})