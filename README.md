## Assassery

A site to track a game of Assassins for Avery House at Caltech!

Assassins is a long-term game where teams of players get targets to "assassinate" while avoiding being assassinated themselves.

Frontend: React.js, backend: Django.

Instructions for testing:
Make sure you have npm version 5+, Python 3, and pip installed.
Run
``pip install pipenv``, ``pipenv shell``, and ``pipenv install``.

In frontend, run `npm install`.

To compile the frontend, use `npm run dev` in frontend. 

To launch the site on localhost:8000, run `pipenv shell` and `python manage.py runserver`. 

Testing Facebook integration requires a secure web URL for the Assassery Messenger bot. You can use [Ngrok](https://ngrok.com/) and pass the url (`<url>/messenger/api`)
to the Assassery bot. 

API keys and such are stored in a file called `vars.py` at the top level of the project. It is not in the repository: contact me personally if you need them.

TODO (in no particular order):
- Make leaderboard use kill-death ratio or kills - deaths instead of ordered ranking
- Make git pull leave the database unaffected
- Add lines between rounds in kill feed
- Fix text size for kill confirm modal on mobile
- Add tool to unconfirm a kill in admin
- Add "active" checkbox for kills instead of deleting them
- Update rules