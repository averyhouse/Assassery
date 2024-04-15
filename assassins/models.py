from django.db import models
from django.contrib.auth import settings
from django.contrib.auth.models import User, BaseUserManager, AbstractUser
from django.core.mail import send_mail
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
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_members', null=True, blank=True)
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
    legit_kill = models.BooleanField(default=True)
    hide_kill = models.BooleanField(default=False)

    def getKiller(self):
        return User.objects.get(username=self.killer_username).assassin

    # TODO: Make a migration to make it actually take from username, but I am
    # lazy so not doing it now.
    def getVictim(self):
        return User.objects.get(name=self.victim_username).assassin

    def unresolveKill(self):
        games = Game.objects.all()
        if not games:
            return False, 'Game not in progress.'
        game = games[0]

        if not self.legit_kill:
            return False, 'Kill already unresolved'

        try:
            victim_user = User.objects.get(name=self.victim_username)
        except User.DoesNotExist:
            return False, 'Killed user does not exist.'

        try:
            killer_user = User.objects.get(username=self.killer_username)
        except User.DoesNotExist:
            return False, 'Killer user does not exist.'

        try:
            victim = victim_user.player
        except User.player.RelatedObjectDoesNotExist:
            return False, 'Victim does not exist.'

        try:
            killer = killer_user.player
        except User.player.RelatedObjectDoesNotExist:
            return False, 'Killer does not exist.'

        killer_team = killer.team
        target_team = killer_team.target
        victim_team = victim.team

        if not target_team or target_team.id != victim_team.id:
            return False, 'Victim not in target team.'

        victim.dead = False
        victim.deathcount -= 1
        victim.save()

        killer.killcount -= 1
        killer.save()

        # keep confirmed to be true.
        self.confirmed = True
        self.legit_kill = False
        self.save()

        for assassin in killer_team.getMembers():
            send_mail(
                '[Assery] Kill reverted!',
                'Your kill got reverted! It did not count. Please email the game admins if you believe this judgment to be false',
                None,
                [assassin.player.email],
                fail_silently=True
            )
        # Notify the target team that one player is down
        target_message = "Your team member, " + victim.player.name + " was not eliminated by " + killer.player.username + \
                         ". \nThey have respawned."
        for assassin in victim_team.getMembers():
            send_mail(
                '[Assery] Team Member back!',
                target_message,
                None,
                [assassin.player.email],
                fail_silently=True
            )

        return True, 'Success!'



    def resolveKill(self):
        games = Game.objects.all()

        if not games:
            return False, 'Game not in progress.'

        game = games[0]

        if self.confirmed:
            return False, 'Kill already confirmed.'

        try:
            victim_user = User.objects.get(name=self.victim_username)
        except User.DoesNotExist:
            return False, 'Killed user does not exist.'

        try:
            killer_user = User.objects.get(username=self.killer_username)
        except User.DoesNotExist:
            return False, 'Killer user does not exist.'

        try:
            victim = victim_user.player
        except User.player.RelatedObjectDoesNotExist:
            return False, 'Victim does not exist.'

        try:
            killer = killer_user.player
        except User.player.RelatedObjectDoesNotExist:
            return False, 'Killer does not exist.'

        if victim.dead:
            return False, 'Victim already dead.'

        killer_team = killer.team
        target_team = killer_team.target
        victim_team = victim.team

        if not target_team or target_team.id != victim_team.id:
            return False, 'Victim not in target team.'

        victim.dead = True
        victim.deathcount += 1
        victim.save()

        killer.killcount += 1
        killer.save()

        self.confirmed = True
        self.save()

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
                for assassin in next_target.getMembers():
                    send_mail(
                        '[Assery] Hunter Team Eliminated!!',
                        "The team hunting you has been completely eliminated. You now have new hunters!",
                        None,
                        [assassin.player.email],
                        fail_silently=True
                    )
            killer_team.save()

        # Notify the killer's team that one target is down
        killer_message = "Congratulations! Your team eliminated " + \
                         victim.player.name + ". \n\n"

        if not live_targets:
            killer_message += "You have completely eliminated the enemy team. Check your dashboard to see your new targets!"
        else:
            killer_message += "The remaining members of your target team are:\n" + "\n".join(str(target) for target in live_targets) + "."

        for assassin in killer_team.getMembers():
            send_mail(
                '[Assery] Target Down!',
                killer_message,
                None,
                [assassin.player.email],
                fail_silently=True
            )
        # Notify the target team that one player is down
        target_message = "Your team member, " + victim.player.name + " was eliminated by " + killer.player.username + \
                         ". \nThey will respawn at the next game reset."
        for assassin in victim_team.getMembers():
            send_mail(
                '[Assery] Team Member Down!',
                target_message,
                None,
                [assassin.player.email],
                fail_silently=True
            )

        return True, 'Success!'

    def __str__(self):
        return self.victim_username + " died by " + self.message


class Game(models.Model):
    """
    Maintains game status.
    """
    inprogress = models.BooleanField()
    winner = models.CharField(max_length=30, default='N/A')
