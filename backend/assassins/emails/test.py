from post_office import mail

mail.send(
    'soyjulen@example.com',  # List of email addresses also accepted
    'from@example.com',
    subject='My email',
    message='Hi there!',
    html_message='Hi <strong>there</strong>!',
)