from django.test import TestCase, Client
from .models import *
from rest_framework import status
import base64, os, json

dirname = os.path.realpath('..')
rel_path = 'Assassery/frontend/src/assets/images/camera_icon.png'
img_path = os.path.join(dirname, rel_path)

class RegisterTestCase(TestCase):

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
            response = self.client.post(self.api, data=data, format="json")
        content = json.loads(response.content.decode('utf-8'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {'username' : 'JD', 'email' : 'jd@caltech.edu'}
        actual = content['user']
        self.assertEqual(expected, actual)

        self.assertTrue('token' in content)

    def test_missing_user_info(self):
        data = {
            'name' : 'Jane Doe',
            'username' : 'JD',
            'password' : 'secret',
            'email' : 'jd@caltech.edu'
        }
        response = self.client.post(self.api, data=data, format="json")
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
            response = self.client.post(self.api, data=data, format="json")
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        expected = {'email' : ['Please input a Caltech email.']}
        actual = content
        self.assertEqual(expected, actual)


class LoginTestCase(TestCase):
    
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
            self.client.post(reg_api, data=data, format="json")

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

        expected = {'id': 1, 'team': 1, 'dead': False}
        actual = content['assassin']
        self.assertEqual(expected, actual)

    def test_missing_credentials(self):
        response = self.client.post(self.api, data={}, format='json')
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

class UserTestCase(TestCase):

    api = '/api/auth/user/'

    def test_missing_credentials(self):
        response = self.client.get(self.api, header={}, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        expected = {
            'detail': 'Authentication credentials were not provided.'
        }
        actual = content
        self.assertEqual(expected, actual)

    def test_invalid_token(self):
        header = {
            'authorization' : 'Token invalid'
        }
        response = self.client.get(self.api, header=header, format='json')
        content = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        expected = {
            'detail': 'Authentication credentials were not provided.'
        }
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
            response = self.client.post(reg_api, data=data, format="json")
        content = json.loads(response.content.decode('utf-8'))

        header = {
            'authorization' : 'Token ' + content['token']
        }
        client = Client()
        response = client.get(self.api, header=header, content_type='application/json', secure=True)
        content = json.loads(response.content.decode('utf-8'))

        print(response.data)
        print(content)
        