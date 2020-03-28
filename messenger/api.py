from rest_framework import viewsets, permissions, generics, authentication
from rest_framework.response import Response
from django.http.response import HttpResponse
import json
import requests
from ..vars import *


def post_message(fbid, message):
    post_message_url = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + facebook_access_token
    response_msg = json.dumps({"recipient": {"id": fbid}, "message": {"text": message}})
    requests.post(post_message_url, headers={"Content-Type": "application/json"}, data=response_msg)

class MessengerAPI(generics.GenericAPIView):

    def get(self, request):
        if self.request.GET["hub.verify_token"] == facebook_verify_token:
            return HttpResponse(self.request.GET["hub.challenge"])
        else:
            return HttpResponse("Error, invalid token")

    def post(self, request):
        incoming_message = json.loads(self.request.body.decode('utf-8'))

        for entry in incoming_message['entry']:
            for message in entry['messaging']:
                # Check to make sure the received call is a message call
                # This might be delivery, optin, postback for other events
                if 'message' in message:
                    # Print the message to the terminal
                    print(message)
                    post_message(message['sender']['id'], message['message']['text'])
        return HttpResponse()
