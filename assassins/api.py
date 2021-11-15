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
#   --data '{"username": "USERNAME", "email": "EMAIL", "password": "PASSWORD", "name": "NAME" }'
class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        print(request.FILES)
        # if 'messenger' not in request.data:
            # request.data['messenger'] = None
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

        try:
            assassin = user.player
            assassin = AssassinSerializer(assassin).data
        except User.player.RelatedObjectDoesNotExist:
            assassin = None

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1],
            "assassin": assassin,
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

        try:
            killer = Assassin.objects.get(id=kill['killerID'])
        except Assassin.DoesNotExist:
            return Response({
                'result': 'failure',
                'message': 'player does not exist'
            })

        if killer.dead:
            return Response({
                'result': 'failure',
                'message': 'player is dead'
            })

        try:
            victim = Assassin.objects.get(id=kill['killedID'])
        except Assassin.DoesNotExist:
            return Response({
                'result': 'failure',
                'message': 'victim does not exist'
            })

        if victim.dead:
            return Response({
                'result': 'failure',
                'message': 'victim is already dead'
            })

        killer_team = killer.team
        if not killer_team:
            return Response({
                'result': 'failure',
                'message': 'player is not in a team'
            })

        victim_team = victim.team
        if not victim_team:
            return Response({
                'result': 'failure',
                'message': 'victim is not in a team'
            })
            
        target_team = killer_team.target_team
        victim_team = victim.team

        if target_team.id != victim_team.id:
            return Response({
                'result': 'failure',
                'message': 'victim not in target team'
            })

        victim.dead = True
        victim.save()

        live_targets = victim_team.team_members.filter(dead=False)
        if not live_targets:
            killer_team.target = victim_team.target
            killer_team.save()
            victim_team.target = None
            victim_team.save()
            if killer_team.id == killer_team.target.id:
                game = Game.objects.get(id=1)
                game.inprogress = False
                game.save()

        kill = serializer.save()
        
        return Response({'result': 'success'})
