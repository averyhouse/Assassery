from django.db import models
from django.contrib.auth import settings
from django.contrib.auth.models import User, BaseUserManager, AbstractUser
from django.utils.translation import ugettext_lazy as _

class Assassin(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30)
    alias = models.CharField(max_length=30)
    team = models.IntegerField()
    target = models.IntegerField()
    dead = models.BooleanField()

    @staticmethod
    def getModel(userID):
        return Assassin.objects.get(id = userID)

    def nextTarget(self):
        t = Assassin.getModel(self.target)
        while(t.dead):
            t = Assassin.getModel(t.target)
        return t.id

    def kill(self):
        t = Assassin.getModel(self.nextTarget())
        n = t.nextTarget()
        t.dead = True
        t.save()
        self.target = n
        self.save()

    def _str_(self):
        return self.alias

class KillFeed(models.Model):
    killerID = models.IntegerField(primary_key=True)
    killedID = models.IntegerField()
    message = models.TextField()
    timeStamp = models.DateField()

class Person(models.Model):
    id = models.IntegerField(primary_key = True)
    username = models.CharField(max_length = 30)
    password = models.CharField(max_length = 60)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="player", on_delete=models.CASCADE, null=True)
    email = models.CharField(max_length = 30)
    messenger = models.CharField(max_length = 30)

    def _str_(self):
        return self.username

class Respawn(models.Model):
    id = models.IntegerField(primary_key = True)

class User(AbstractUser):
    USERNAME_FIELD = 'email'
    email = models.EmailField(_('email address'), unique=True) # changes email to unique and blank to false
    REQUIRED_FIELDS = [] # removes email from REQUIRED_FIELDS
