from django.contrib import admin
from .models import Assassin, User, KillFeed, Respawn

class AssAssmin(admin.ModelAdmin):
    list_display = ('id', 'get_playername', 'team', 'get_target_player', 'dead')

    def get_playername(self, obj):
        return obj.player.username if obj.player is not None else None

    def get_target_player(self, obj):
        return obj.target.player.username if obj.target is not None and obj.target.player is not None else None

    get_playername.admin_order_field  = 'player'  #Allows column order sorting
    get_playername.short_description = 'Player'  #Renames column head

    get_target_player.admin_order_field  = 'target'  #Allows column order sorting
    get_target_player.short_description = 'Target'  #Renames column head

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'name', 'email') #, 'messenger')

class KillAdmin(admin.ModelAdmin):
    list_display = ('killer', 'killed', 'message', 'timeStamp')

class RespawnAdmin(admin.ModelAdmin):
    list_display = ('id', 'assassin', 'timestamp')

admin.site.register(Assassin, AssAssmin)
admin.site.register(User, UserAdmin)
admin.site.register(KillFeed, KillAdmin)
admin.site.register(Respawn, RespawnAdmin)
