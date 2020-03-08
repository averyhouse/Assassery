from ...backend.settings import EMAIL_HOST_USER
from post_office import mail

mail.send(
    'recipient@example.com',  # List of email addresses also accepted
    'from@example.com',
    subject='My email',
    message='Hi there!',
    html_message='Hi <strong>there</strong>!',
)
from post_office import mail

mail.send(
    'recipient@example.com',  # List of email addresses also accepted
    'from@example.com',
    subject='My email',
    message='Hi there!',
    html_message='Hi <strong>there</strong>!',
)