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
    messenger = models.CharField(max_length=30, null=True, blank=True)
    name = models.CharField(max_length=30)
    photo = models.ImageField(upload_to='photos', null=True, blank=True)
    USERNAME_FIELD = 'email'
    email = models.EmailField(_('email address'), unique=True) # changes email to unique and blank to false
    REQUIRED_FIELDS = ['username', 'name'] # removes email from REQUIRED_FIELDS

    @staticmethod
    def getModel(userID):
        return User.objects.get(id=userID)

    def __str__(self):
        return self.name

class Assassin(models.Model):
    """
    The Assassin model stores information about a particular player in the game.
    It does not exist without the game running!
    """
    id = models.IntegerField(primary_key=True)
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player', null=True, blank=True)
    team = models.IntegerField()
    target = models.ForeignKey('self', on_delete=models.PROTECT, null=True, blank=True)
    dead = models.BooleanField()

    @staticmethod
    def getModel(userID):
        return Assassin.objects.get(id=userID)

    def nextTarget(self):
        t = Assassin.getModel(self.target)
        while(t.dead):
            t = Assassin.getModel(t.target)
        return t.id

    def kill(self, id):
        t = Assassin.getModel(id)
        t.dead = True
        t.save()
        self.target = self.nextTarget()
        self.save()
        KillFeed.objects.create(killer=self, killed=Assassin.getModel(id), message="F", timeStamp=datetime.datetime.now())

    def __str__(self):
        return self.player.__str__()

class Team(models.Model):
    """
    The Team model stores information about which Assassins are on a team, whether the team is still in play, and name.
    """

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
    id = models.IntegerField(primary_key=True)
    assassin = models.ForeignKey(Assassin, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(null=True)