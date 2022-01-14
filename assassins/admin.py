from django.contrib import admin
from .models import Assassin, User, KillFeed, Team, Game
import random

class AssAssmin(admin.ModelAdmin):
    list_display = ('id', 'get_playername', 'team', 'dead', 'killcount', 'deathcount')

    def get_playername(self, obj):
        return obj.player.username if obj.player is not None else None

    get_playername.admin_order_field  = 'player'  #Allows column order sorting
    get_playername.short_description = 'Player'  #Renames column head

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'name', 'email') #, 'messenger')

class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'target')

class KillAdmin(admin.ModelAdmin):
    list_display = ('id', 'killer_username', 'victim_username', 'message', 'timestamp')

class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'inprogress', 'winner')
    actions = ['reset']

    @admin.action(description='Reset game')
    def reset(self, request, queryset):
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
