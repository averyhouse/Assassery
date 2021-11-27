from django.contrib.auth import settings
from rest_framework import viewsets, permissions, generics, authentication, status
from rest_framework.response import Response
from knox.models import AuthToken
import knox

from .models import *
from .serializers import AssassinSerializer, CreateUserSerializer, UserSerializer, LoginUserSerializer, KillSerializer

from django.http import QueryDict
# from datetime import datetime

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

        '''
        try:
            assassin = user.player
            assassin = AssassinSerializer(assassin).data
        except User.player.RelatedObjectDoesNotExist:
            assassin = None
        '''

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1],
            # "assassin": assassin
        })


# curl --request GET \
#   --url http://localhost:8000/api/game/status/ \
#   --header 'authorization: Token TOKEN' \
#   --header 'content-type: application/json' \
class StatusAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        def serialize_team(team):
            team_members = team.team_members
            members = []
            for member in team_members.all():
                dead = member.dead
                player = member.player
                alias = player.username
                name = player.name
                members.append({"alias" : alias, "name" : name, "dead" : dead})
            return {"name" : team.name, "members" : members}

        user = self.request.user
        data = {}

        try:
            assassin = user.player
        except User.player.RelatedObjectDoesNotExist:
            return Response({
                'result': 'failure',
                'message': 'Player does not exist.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        team = assassin.team
        data['team'] = serialize_team(team)
        
        target = team.target
        data['target'] = serialize_team(target) if target else None
        
        try:
            hunter = team.hunter_team
        except Team.hunter_team.RelatedObjectDoesNotExist:
            data['hunter'] = None
            return Response(data)
        
        data['hunter'] = serialize_team(hunter)
        return Response(data)


# curl --request GET \
#   --url http://localhost:8000/api/game/home/ \
#   --header 'content-type: application/json' \
class DashboardAPI(generics.GenericAPIView):
    
    def get(self, request):

        def time(kill):
            t = kill.timestamp
            return t.strftime("%m/%d/%Y, %H:%M:%S")

        kills = KillFeed.objects.order_by('-timestamp')[:5]
        kills = [{'timestamp' : time(k), 'message' : str(k)} for k in kills]
        
        leads = Assassin.objects.order_by('-killcount', 'deathcount')[:5]
        leads = [(p.player.username, p.killcount, p.deathcount) for p in leads]
        leads = [{'alias' : a, 'kills' : k, 'deaths' : d} for a, k, d in leads]

        return Response({'killfeed' : kills, 'leaderboard' : leads})


# curl --request GET \
#   --url http://localhost:8000/api/game/assassin/ \
#   --header 'authorization: Token TOKEN' \
#   --header 'content-type: application/json' \
class AssassinAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = self.request.user

        try:
            assassin = user.player
        except User.player.RelatedObjectDoesNotExist:
            return Response({
                'result': 'failure',
                'message': 'Player does not exist.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        return Response({'assassin' : AssassinSerializer(assassin).data})


# curl --request GET \
#   --url http://localhost:8000/api/auth/user/ \
#   --header 'authorization: Token TOKEN' \
#   --header 'content-type: application/json' \
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class GameAPI(generics.GenericAPIView):

    def get(self, request):
        games = Game.objects.all()
        if not games:
            return Response({
                'result' : 'failure',
                'message' : 'No game in DB'
            })
        game = games[0]
        return Response({
            'inprogress' : game.inprogress,
            'winner' : game.winner
        })


# curl --request POST \
#   --url http://localhost:8000/api/game/kill/ \
#   --header 'authorization: Token TOKEN' \
#   --header 'content-type: application/json' \
#   --data '{"killer_username": "KNAME", "victim_username": "VNAME" [, "message" : "MSG"]}' \
class KillAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = KillSerializer        

    def post(self, request):
        # data = request.data.copy()
        # data['timestamp'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        kill = serializer.validated_data

        games = Game.objects.all()
        
        if not games:
            return Response({
                'result': 'failure',
                'message': 'Game not in progress.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        game = games[0]

        if kill['killer_username'] != self.request.user.username:
            return Response({
                'result': 'failure',
                'message': 'killer_username does not match authenticated user.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            killer_user = User.objects.get(username=kill['killer_username'])

        try:
            victim_user = User.objects.get(username=kill['victim_username'])
        except User.DoesNotExist:
            return Response({
                'result': 'failure',
                'message': 'Scanned user does not exist.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        try:
            killer = killer_user.player
        except User.player.RelatedObjectDoesNotExist:
            return Response({
                'result': 'failure',
                'message': 'Player does not exist.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        if killer.dead:
            return Response({
                'result': 'failure',
                'message': 'Player is dead.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        try:
            victim = victim_user.player
        except User.player.RelatedObjectDoesNotExist:
            return Response({
                'result': 'failure',
                'message': 'Victim does not exist.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        if victim.dead:
            return Response({
                'result': 'failure',
                'message': 'Victim is already dead.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        killer_team = killer.team
        victim_team = victim.team
            
        target_team = killer_team.target
        victim_team = victim.team

        if not target_team or target_team.id != victim_team.id:
            return Response({
                'result': 'failure',
                'message': 'Victim not in target team.'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        victim.dead = True
        victim.deathcount += 1
        victim.save()

        killer.killcount += 1
        killer.save()

        live_targets = victim_team.team_members.filter(dead=False)
        if not live_targets:
            next_target = victim_team.target
            victim_team.target = None
            victim_team.save()
            if not next_target or killer_team.id == next_target.id:
                killer_team.target = None
                game.inprogress = False
                game.winner = killer_team.name
                game.save()
            else:
                killer_team.target = next_target
            killer_team.save()

        kill = serializer.save()
        
        return Response({'result': 'success'})
