from django.contrib import admin
from .models import Assassin

class AssAssmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'alias', 'team', 'target', 'dead')

admin.site.register(Assassin, AssAssmin)
#Assassin.getModel(12).kill()