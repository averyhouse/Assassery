# Generated by Django 3.0.4 on 2020-03-19 05:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assassins', '0004_auto_20200319_0458'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assassin',
            name='player',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='assassin',
            name='target',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='assassins.Assassin'),
        ),
        migrations.AlterField(
            model_name='killfeed',
            name='killed',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='killed', to='assassins.Assassin'),
        ),
        migrations.AlterField(
            model_name='killfeed',
            name='killer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='killer', to='assassins.Assassin'),
        ),
        migrations.AlterField(
            model_name='respawn',
            name='assassin',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='assassins.Assassin'),
        ),
    ]