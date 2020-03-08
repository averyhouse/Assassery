from django.contrib import admin
from .models import Assassin, User

class AssAssmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'alias', 'team', 'target', 'dead')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'messenger')

admin.site.register(Assassin, AssAssmin)
admin.site.register(User, UserAdmin)
#Assassin.getModel(12).kill()