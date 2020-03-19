# Generated by Django 3.0.4 on 2020-03-19 04:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assassins', '0003_auto_20200319_0447'),
    ]

    operations = [
        migrations.AddField(
            model_name='respawn',
            name='nextId',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='assassin',
            name='target',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='assassins.Assassin'),
        ),
        migrations.AlterField(
            model_name='respawn',
            name='assassin',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='assassins.Assassin'),
        ),
        migrations.AlterField(
            model_name='respawn',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]