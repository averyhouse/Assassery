from django.contrib import admin
from .models import Assassin, User, KillFeed, Respawn, Team, Game

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

class RespawnAdmin(admin.ModelAdmin):
    list_display = ('id', 'assassin', 'timestamp')

class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'inprogress', 'winner')

admin.site.register(Assassin, AssAssmin)
admin.site.register(User, UserAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(KillFeed, KillAdmin)
admin.site.register(Respawn, RespawnAdmin)
admin.site.register(Game, GameAdmin)
