from django.db import models
from django.contrib.auth import settings
from django.contrib.auth.models import User, BaseUserManager, AbstractUser
from django.utils.translation import ugettext_lazy as _
import datetime

class User(AbstractUser):
    """
    The User model allows people to log in to the Assassery website.
    It is NOT associated with a player in game.
    """
    # messenger = models.CharField(max_length=30, null=True, blank=True)
    name = models.CharField(max_length=30)
    photo = models.ImageField(upload_to='photos', null=False, blank=False)
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email' # specifies that the email field should be used as a unique identifier
    REQUIRED_FIELDS = ['username', 'name'] # removes photo from REQUIRED_FIELDS

    @staticmethod
    def getModel(userID):
        return User.objects.get(id=userID)

    def __str__(self):
        return self.name

class Team(models.Model):
    """
    The Team model stores the team name and the target team.
    """
    name = models.CharField(max_length=30)
    target = models.OneToOneField('self', on_delete=models.CASCADE, related_name='target_team', null=True)

class Assassin(models.Model):
    """
    The Assassin model stores information about a particular player in the game.
    It does not exist without the game running!
    """
    player = models.OneToOneField(User, on_delete=models.CASCADE, related_name='player', null=True, blank=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_members', null=True, blank=True)
    dead = models.BooleanField()

    @staticmethod
    def getModel(userID):
        return Assassin.objects.get(id=userID)

    def __str__(self):
        return self.player.__str__()

class KillFeed(models.Model):
    """
    The KillFeed model stores information about a particular instance of a kill to display on the kill feed.
    """
    killer = models.ForeignKey(Assassin, on_delete=models.PROTECT, related_name='killer', null=True, blank=True)
    killed = models.ForeignKey(Assassin, on_delete=models.PROTECT, related_name='killed', null=True, blank=True)
    message = models.TextField()
    timeStamp = models.DateTimeField()

    def __str__(self):
        return self.killer.player.__str__() + " killed " + self.killed.player.__str__() + " by " + self.message

class Respawn(models.Model):
    """
    The Respawn model stores information about the respawn queue.
    """
    assassin = models.ForeignKey(Assassin, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(null=True)

class Game(models.Model):
    """
    Maintains game status.
    """
    inprogress = models.BooleanField()