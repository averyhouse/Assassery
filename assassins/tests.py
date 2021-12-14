from rest_framework.test import APITestCase
from .models import *
from rest_framework import status
from datetime import datetime
import base64, os, json

dirname = os.path.realpath('..')
rel_path = 'Assassery/frontend/src/assets/images/camera_icon.png'
img_path = os.path.join(dirname, rel_path)


class RegisterTestCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        tmp = 'Assassery/media/photos/'
        tmp_path = os.path.join(dirname, tmp)

        directory = os.fsencode(tmp_path)
    
        for f in os.listdir(directory):
            filename = os.fsdecode(f)
            if filename.startswith("camera_icon_"):
                os.remove(tmp_path + filename)

    api = '/api/auth/register/'

    def test_basic_user_registration(self):
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Jane Doe',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jd@caltech.edu',
                'photo' : photo
            }
            response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {'username' : 'JD', 'email' : 'jd@caltech.edu'}
        actual = content['user']
        self.assertEqual(expected, actual)

        self.assertTrue('token' in content)

    def test_duplicate_username(self):
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Jane Doe',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jd@caltech.edu',
                'photo' : photo
            }
            response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Johnny Depp',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jdepp@caltech.edu',
                'photo' : photo
            }
            response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        expected = {'username': ['user with this username already exists.']}
        actual = content
        self.assertEqual(expected, content)

    def test_missing_user_info(self):
        data = {
            'name' : 'Jane Doe',
            'username' : 'JD',
            'password' : 'secret',
            'email' : 'jd@caltech.edu'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        expected = {'photo' : ['No file was submitted.']}
        actual = content
        self.assertEqual(expected, actual)

    def test_noncaltech_email(self):
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Jane Doe',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jd@gmail.com',
                'photo' : photo
            }
            response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        expected = {'email' : ['Please input a Caltech email.']}
        actual = content
        self.assertEqual(expected, actual)


class LoginTestCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        tmp = 'Assassery/media/photos/'
        tmp_path = os.path.join(dirname, tmp)

        directory = os.fsencode(tmp_path)
    
        for f in os.listdir(directory):
            filename = os.fsdecode(f)
            if filename.startswith("camera_icon_"):
                os.remove(tmp_path + filename)
    
    api = '/api/auth/login/'

    def setUp(self):
        reg_api = '/api/auth/register/'
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Jane Doe',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jd@caltech.edu',
                'photo' : photo
            }
            self.client.post(reg_api, data=data)

    def test_registered_user(self):
        data = {
            'email' : 'jd@caltech.edu',
            'password' : 'secret'
        }
        response = self.client.post(self.api, data=data, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {'username': 'JD', 'email': 'jd@caltech.edu'}
        actual = content['user']
        self.assertEqual(expected, actual)

        self.assertIsNone(content['assassin'])
        self.assertTrue('token' in content)
    
    def test_registered_player(self):
        team = Team(name='team', target=None)
        team.save()

        user = User.objects.get(pk=1)

        assassin = Assassin(player=user, team=team, dead=False)
        assassin.save()

        data = {
            'email' : 'jd@caltech.edu',
            'password' : 'secret'
        }
        response = self.client.post(self.api, data=data, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {'dead': False}
        actual = content['assassin']
        self.assertEqual(expected, actual)

    def test_missing_credentials(self):
        response = self.client.post(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        expected = {
            'email' : ['This field is required.'],
            'password' : ['This field is required.']
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_unregistered_user(self):
        data = {
            'email' : 'sneaky@caltech.edu',
            'password' : 'shhh'
        }
        response = self.client.post(self.api, data=data, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        expected = {
            'non_field_errors' : ['Unable to log in with provided credentials']
        }
        actual = content
        self.assertEqual(expected, actual)


class StatusTestCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        tmp = 'Assassery/media/photos/'
        tmp_path = os.path.join(dirname, tmp)

        directory = os.fsencode(tmp_path)
    
        for f in os.listdir(directory):
            filename = os.fsdecode(f)
            if filename.startswith("camera_icon_"):
                os.remove(tmp_path + filename)

    api = '/api/game/status/'

    def setUp(self):
        reg_api = '/api/auth/register/'
        
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Jane Doe',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jd@caltech.edu',
                'photo' : photo
            }
            response = self.client.post(reg_api, data=data)
        content = json.loads(response.content.decode('utf-8'))
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + content['token'])

    def test_no_associated_player(self):
        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        expected = {
            'result': 'failure', 
            'message': 'Player does not exist.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_basic_team(self):
        team = Team(name='team', target=None)
        team.save()

        user = User.objects.get(username='JD')

        assassin = Assassin(player=user, team=team, dead=True)
        assassin.save()

        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        members = [{'alias' : 'JD', 'name' : 'Jane Doe', 'dead' : True}]
        expected = {
            'target': None,
            'team' : {'name' : 'team', 'members' : members},
            'hunter' : None
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_team_with_target(self):
        target = Team(name='target', target=None)
        target.save()

        team = Team(name='team', target=target)
        team.save()

        user = User.objects.get(username='JD')

        assassin = Assassin(player=user, team=team, dead=False)
        assassin.save()

        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        members = [{'alias' : 'JD', 'name' : 'Jane Doe', 'dead' : False}]
        expected = {
            'target': {'name' : 'target', 'members' : []},
            'team' : {'name' : 'team', 'members' : members},
            'hunter' : None
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_team_with_hunter(self):
        target = Team(name='target', target=None)
        target.save()

        team = Team(name='team', target=target)
        team.save()

        hunter = Team(name='hunter', target=team)
        hunter.save()

        reg_api = '/api/auth/register/'

        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Teammate',
                'username' : 'TM',
                'password' : 'secret',
                'email' : 'tm@caltech.edu',
                'photo' : photo
            }
            self.client.post(reg_api, data=data)

        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Hunter',
                'username' : 'H',
                'password' : 'secret',
                'email' : 'h@caltech.edu',
                'photo' : photo
            }
            self.client.post(reg_api, data=data)

        user = User.objects.get(username='JD')

        assassin = Assassin(player=user, team=team, dead=False)
        assassin.save()

        user = User.objects.get(username='TM')

        assassin = Assassin(player=user, team=team, dead=False)
        assassin.save()

        user = User.objects.get(username='H')

        assassin = Assassin(player=user, team=hunter, dead=False)
        assassin.save()

        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        team_members = [{'alias' : 'JD', 'name' : 'Jane Doe', 'dead' : False}, 
                        {'alias' : 'TM', 'name' : 'Teammate', 'dead' : False}]
        hunters = [{'alias' : 'H', 'name' : 'Hunter', 'dead' : False}]
        expected = {
            'target': {'name' : 'target', 'members' : []},
            'team' : {'name' : 'team', 'members' : team_members},
            'hunter' : {'name' : 'hunter', 'members' : hunters}
        }
        actual = content
        self.assertEqual(expected, actual)


class DashboardTestCase(APITestCase):

    api = '/api/game/dashboard/'

    def test_empty_tables(self):
        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {'killfeed' : [], 'leaderboard' : []}
        actual = content
        self.assertEqual(expected, actual)

    def test_two_kills_and_leads(self):
        n = 2
        
        for i in range(n):
            ku, vu = 'K' + str(i), 'V' + str(i)
            KillFeed.objects.create(killer_username=ku, victim_username=vu)
            
            reg_api = '/api/auth/register/'
            with open(img_path, "rb") as photo:
                data = {
                    'name' : ku,
                    'username' : ku,
                    'password' : 'secret',
                    'email' : ku + '@caltech.edu',
                    'photo' : photo
                }
                self.client.post(reg_api, data=data)

            team = Team.objects.create(name='team')

            user = User.objects.get(username=ku)
            Assassin.objects.create(player=user, team=team, killcount=i)

        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(content['killfeed']), 2)
        self.assertEqual(len(content['leaderboard']), 2)

        for i in range(n):
            j = n - i - 1
            ku, vu = 'K' + str(j), 'V' + str(j)
            expected = ku + ' killed ' + vu + ' by spraying them with water'
            actual = content['killfeed'][i]['message']
            self.assertEqual(expected, actual)

            expected = {'alias' : ku, 'kills' : j, 'deaths' : 0}
            actual = content['leaderboard'][i]
            self.assertEqual(expected, actual)

    def test_seven_kills_and_leads(self):
        n = 7
        
        for i in range(n):
            ku, vu = 'K' + str(i), 'V' + str(i)
            KillFeed.objects.create(killer_username=ku, victim_username=vu)
            
            reg_api = '/api/auth/register/'
            with open(img_path, "rb") as photo:
                data = {
                    'name' : ku,
                    'username' : ku,
                    'password' : 'secret',
                    'email' : ku + '@caltech.edu',
                    'photo' : photo
                }
                self.client.post(reg_api, data=data)

            team = Team.objects.create(name='team')

            user = User.objects.get(username=ku)
            Assassin.objects.create(player=user, team=team, deathcount=n-i)

        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(content['killfeed']), 5)
        self.assertEqual(len(content['leaderboard']), 5)

        for i in range(5):
            j = n - i - 1
            ku, vu = 'K' + str(j), 'V' + str(j)
            expected = ku + ' killed ' + vu + ' by spraying them with water'
            actual = content['killfeed'][i]['message']
            self.assertEqual(expected, actual)

            expected = {'alias' : ku, 'kills' : 0, 'deaths' : n - j}
            actual = content['leaderboard'][i]
            self.assertEqual(expected, actual)


class UserTestCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        tmp = 'Assassery/media/photos/'
        tmp_path = os.path.join(dirname, tmp)

        directory = os.fsencode(tmp_path)
    
        for f in os.listdir(directory):
            filename = os.fsdecode(f)
            if filename.startswith("camera_icon_"):
                os.remove(tmp_path + filename)

    api = '/api/auth/user/'

    def test_missing_credentials(self):
        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        expected = {'detail': 'Authentication credentials were not provided.'}
        actual = content
        self.assertEqual(expected, actual)

    def test_bad_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token bad')
        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        expected = {'detail': 'Invalid token.'}
        actual = content
        self.assertEqual(expected, actual)

    def test_good_token(self):
        reg_api = '/api/auth/register/'
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Jane Doe',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jd@caltech.edu',
                'photo' : photo
            }
            response = self.client.post(reg_api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + content['token'])
        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {'username': 'JD', 'email': 'jd@caltech.edu'}
        actual = content['user']
        self.assertEqual(expected, actual)

        self.assertIsNone(content['assassin'])

    def test_expired_token(self):
        reg_api = '/api/auth/register/'
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Jane Doe',
                'username' : 'JD',
                'password' : 'secret',
                'email' : 'jd@caltech.edu',
                'photo' : photo
            }
            response = self.client.post(reg_api, data=data)
        content = json.loads(response.content.decode('utf-8'))
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + content['token'])

        out_api = '/api/auth/logout/'
        self.client.post(out_api, format='json')

        response = self.client.get(self.api, format='json')
        content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# TODO: check that KillFeed table is properly updated on kill
class KillTestCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        tmp = 'Assassery/media/photos/'
        tmp_path = os.path.join(dirname, tmp)

        directory = os.fsencode(tmp_path)
    
        for f in os.listdir(directory):
            filename = os.fsdecode(f)
            if filename.startswith("camera_icon_"):
                os.remove(tmp_path + filename)

    api = '/api/game/kill/'
    
    def setUp(self):
        reg_api = '/api/auth/register/'
        
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Kira',
                'username' : 'K',
                'password' : 'notebook',
                'email' : 'k@caltech.edu',
                'photo' : photo
            }
            response = self.client.post(reg_api, data=data)
        content = json.loads(response.content.decode('utf-8'))
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + content['token'])

        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Victim',
                'username' : 'V',
                'password' : 'doomed',
                'email' : 'v@caltech.edu',
                'photo' : photo
            }
            self.client.post(reg_api, data=data)

    def test_no_data(self):
        response = self.client.post(self.api)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # The message field has a default value, so it is not required.
        # The timestamp is generated by the api, and should not be included.
        expected = {
            'killer_username': ['This field is required.'], 
            'victim_username': ['This field is required.'], 
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_no_game(self):
        data = {
            'killer_username' : 'K',
            'victim_username' : 'V',
            'message' : 'writing their name in the deathnote'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        expected = {'result': 'failure', 'message': 'Game not in progress.'}
        actual = content
        self.assertEqual(expected, actual)

    def test_unauthenticated_killer(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        data = {
            'killer_username' : 'Imposter',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        expected = {
            'result': 'failure', 
            'message': 'killer_username does not match authenticated user.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_unregistered_victim(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'Imposter'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        expected = {
            'result': 'failure', 
            'message': 'Scanned user does not exist.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_killer_without_associated_player(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        expected = {
            'result': 'failure', 
            'message': 'Player does not exist.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_dead_assassin(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        team = Team(name='team', target=None)
        team.save()

        user = User.objects.get(username='K')

        assassin = Assassin(player=user, team=team, dead=True)
        assassin.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        expected = {
            'result': 'failure', 
            'message': 'Player is dead.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_victim_without_associated_player(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        team = Team(name='team', target=None)
        team.save()

        user = User.objects.get(username='K')

        assassin = Assassin(player=user, team=team, dead=False)
        assassin.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        expected = {
            'result': 'failure', 
            'message': 'Victim does not exist.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_dead_victim(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        victim_team = Team(name='victim team', target=None)
        victim_team.save()

        killer_team = Team(name='killer team', target=victim_team)
        killer_team.save()

        user = User.objects.get(username='V')
        assassin = Assassin(player=user, team=victim_team, dead=True)
        assassin.save()

        user = User.objects.get(username='K')
        assassin = Assassin(player=user, team=killer_team, dead=False)
        assassin.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        expected = {
            'result': 'failure', 
            'message': 'Victim is already dead.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_victim_not_in_target_team(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        victim_team = Team(name='victim team', target=None)
        victim_team.save()

        killer_team = Team(name='killer team', target=None)
        killer_team.save()

        user = User.objects.get(username='V')
        assassin = Assassin(player=user, team=victim_team, dead=False)
        assassin.save()

        user = User.objects.get(username='K')
        assassin = Assassin(player=user, team=killer_team, dead=False)
        assassin.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        expected = {
            'result': 'failure', 
            'message': 'Victim not in target team.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_simple_kill(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        victim_team = Team(name='victim team', target=None)
        victim_team.save()

        killer_team = Team(name='killer team', target=victim_team)
        killer_team.save()

        reg_api = '/api/auth/register/'
        with open(img_path, "rb") as photo:
            data = {
                'name' : 'Teammate',
                'username' : 'TM',
                'password' : 'scared',
                'email' : 'tm@caltech.edu',
                'photo' : photo
            }
            self.client.post(reg_api, data=data)

        user = User.objects.get(username='TM')
        assassin = Assassin(player=user, team=victim_team, dead=False)
        assassin.save()

        user = User.objects.get(username='V')
        assassin = Assassin(player=user, team=victim_team, dead=False)
        assassin.save()

        user = User.objects.get(username='K')
        assassin = Assassin(player=user, team=killer_team, dead=False)
        assassin.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        game = Game.objects.get(pk=1)
        self.assertEqual(game.inprogress, True)

        victim = Assassin.objects.get(pk=2)
        self.assertEqual(victim.dead, True)
        self.assertEqual(victim.deathcount, 1)

        killer = Assassin.objects.get(pk=3)
        self.assertEqual(killer.killcount, 1)

        killer_team = killer.team
        target_team = killer_team.target
        self.assertEqual(target_team.name, 'victim team')
    
    def test_team_wipe(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        next_team = Team(name='next team', target=None)
        next_team.save()

        victim_team = Team(name='victim team', target=next_team)
        victim_team.save()

        killer_team = Team(name='killer team', target=victim_team)
        killer_team.save()

        user = User.objects.get(username='V')
        assassin = Assassin(player=user, team=victim_team, dead=False)
        assassin.save()

        user = User.objects.get(username='K')
        assassin = Assassin(player=user, team=killer_team, dead=False)
        assassin.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        game = Game.objects.get(pk=1)
        self.assertEqual(game.inprogress, True)

        victim = Assassin.objects.get(pk=1)
        self.assertEqual(victim.dead, True)
        self.assertEqual(victim.deathcount, 1)

        victim_team = victim.team
        target_team = victim_team.target
        self.assertIsNone(target_team)

        killer = Assassin.objects.get(pk=2)
        self.assertEqual(killer.killcount, 1)

        killer_team = killer.team
        target_team = killer_team.target
        self.assertEqual(target_team.name, 'next team')

    def test_game_end(self):
        game = Game.objects.create(inprogress=True)
        game.save()

        victim_team = Team(name='victim team', target=None)
        victim_team.save()

        killer_team = Team(name='killer team', target=victim_team)
        killer_team.save()

        victim_team.target = killer_team
        victim_team.save()

        user = User.objects.get(username='V')
        assassin = Assassin(player=user, team=victim_team, dead=False)
        assassin.save()

        user = User.objects.get(username='K')
        assassin = Assassin(player=user, team=killer_team, dead=False)
        assassin.save()

        data = {
            'killer_username' : 'K',
            'victim_username' : 'V'
        }
        response = self.client.post(self.api, data=data)
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        game = Game.objects.get(pk=1)
        self.assertEqual(game.inprogress, False)

        victim = Assassin.objects.get(pk=1)
        self.assertEqual(victim.dead, True)
        self.assertEqual(victim.deathcount, 1)

        victim_team = victim.team
        target_team = victim_team.target
        self.assertIsNone(target_team)

        killer = Assassin.objects.get(pk=2)
        self.assertEqual(killer.killcount, 1)

        killer_team = killer.team
        target_team = killer_team.target
        self.assertIsNone(target_team)
        
