from django.contrib import admin
from django.core.mail import send_mail
from django import forms
from django.contrib.admin.helpers import ActionForm

from .models import Assassin, User, KillFeed, Team, Game
import random

class TeamCreationForm(ActionForm):
    name_field = forms.CharField()

class AssAssmin(admin.ModelAdmin):
    list_display = ('id', 'get_playername', 'team', 'dead', 'killcount', 'deathcount')
    action_form = TeamCreationForm
    actions = ['team']

    def get_playername(self, obj):
        return obj.player.username if obj.player is not None else None

    get_playername.admin_order_field  = 'player'  #Allows column order sorting
    get_playername.short_description = 'Player'  #Renames column head

    @admin.action(description='Add to team')
    def team(self, request, queryset):
        team_name = request.POST['name_field']
        team = Team(name=team_name)
        team.save()
        queryset.update(team=team)

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'name', 'email') #, 'messenger')
    actions = ['email']

    @admin.action(description='Test email')
    def email(self, request, queryset):
        emails = [user.email for user in queryset]
        print(emails)
        send_mail(
            '[Assassery] Test mail',
            'Have a nice day!',
            None,
            emails,
            fail_silently=False,
        )

class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'target')

class KillAdmin(admin.ModelAdmin):
    list_display = ('id', 'killer_username', 'victim_username', 'message', 'timestamp')
    actions = ['confirm', 'unconfirm']

    @admin.action(description='Confirm')
    def confirm(self, request, queryset):
        queryset.update(confirmed=True)

    @admin.action(description='Unconfirm')
    def unconfirm(self, request, queryset):
        queryset.update(confirmed=False)

class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'inprogress', 'winner')
    actions = ['reset']

    @admin.action(description='Reset game')
    def reset(self, request, queryset):
        for player in User.objects.all():
            # We do this in a for loop so that each person gets an email, even if some of the emails are invalid
            send_mail(
                '[Assassery] Game Reset',
                "The game is being reset! All players are now alive, and targets have been reallocated.",
                None,
                [player.email],
                fail_silently=False,
            )
        queryset.update(inprogress=True)
        KillFeed.objects.all().delete()
        Assassin.objects.all().filter(dead=True).update(dead=False)
        Team.objects.all().update(target=None)
        teams = list(Team.objects.all())
        random.shuffle(teams)
        for i in range(len(teams) - 1):
            teams[i].target = teams[i + 1]
            teams[i].save()
        teams[-1].target = teams[0]
        teams[-1].save()

admin.site.register(Assassin, AssAssmin)
admin.site.register(User, UserAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(KillFeed, KillAdmin)
admin.site.register(Game, GameAdmin)
