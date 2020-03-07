from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from knox.models import AuthToken

from .models import Assassin
from .serializers import AssassinSerializer, CreateUserSerializer, UserSerializer


class AssassinViewSet(viewsets.ModelViewSet):
    queryset = Assassin.objects.all()
    permission_classes = [permissions.AllowAny, ]
    serializer_class = AssassinSerializer

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })