from django.db import models
from django.contrib.auth import settings
from django.contrib.auth.models import User, BaseUserManager, AbstractUser
import datetime

USERNAME_LENGTH = 30

class User(AbstractUser):
    """
    The User model allows people to log in to the Assassery website.
    It is NOT associated with a player in game.
    """
    # messenger = models.CharField(max_length=30, null=True, blank=True)
    name = models.CharField(max_length=30)
    username = models.CharField(max_length=USERNAME_LENGTH, unique=True)
    photo = models.ImageField(upload_to='photos', null=False, blank=False)
    email = models.EmailField('email address', unique=True)
    USERNAME_FIELD = 'email' # specifies that the email field should be used as a unique identifier
    REQUIRED_FIELDS = ['username', 'name'] # removes photo from REQUIRED_FIELDS

    @staticmethod
    def getModel(userID):
        return User.objects.get(id=userID)

    def __str__(self):
        return self.username

class Team(models.Model):
    """
    The Team model stores the team name and the target team.
    """
    name = models.CharField(max_length=30, null=False, blank=False)
    target = models.OneToOneField('self', on_delete=models.CASCADE, related_name='hunter_team', null=True, blank=True)

    def getMembers(self):
        return Assassin.objects.filter(team=self)

    def __str__(self):
        return self.name

class Assassin(models.Model):
    """
    The Assassin model stores information about a particular player in the game.
    It does not exist without the game running!
    """
    player = models.OneToOneField(User, on_delete=models.CASCADE, related_name='player', null=False, blank=False)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_members', null=True, blank=False)
    dead = models.BooleanField(default=False)
    killcount = models.PositiveIntegerField(default=0, null=False, blank=False)
    deathcount = models.PositiveIntegerField(default=0, null=False, blank=False)

    @staticmethod
    def getModel(userID):
        return Assassin.objects.get(id=userID)

    def __str__(self):
        return self.player.__str__()

class KillFeed(models.Model):
    """
    The KillFeed model stores information about a particular instance of a kill to display on the kill feed.
    """
    killer_username = models.CharField(max_length=USERNAME_LENGTH)
    victim_username = models.CharField(max_length=USERNAME_LENGTH)
    message = models.CharField(max_length=255, default="spraying them with water")
    timestamp = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=True)

    def getKiller(self):
        return User.objects.get(username=self.killer_username).assassin

    def getVictim(self):
        return User.objects.get(username=self.victim_username).assassin

    def __str__(self):
        return self.killer_username + " killed " + self.victim_username + " by " + self.message

class Game(models.Model):
    """
    Maintains game status.
    """
    inprogress = models.BooleanField()
    winner = models.CharField(max_length=30, default='N/A')