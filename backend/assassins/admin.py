from django.contrib import admin
from .models import Assassin, User, KillFeed

class AssAssmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'alias', 'team', 'target', 'dead')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'messenger')

class KillAdmin(admin.ModelAdmin):
    list_display = ('killerID', 'killedID', 'message', 'timeStamp')

admin.site.register(Assassin, AssAssmin)
admin.site.register(User, UserAdmin)
admin.site.register(KillFeed, KillAdmin)
