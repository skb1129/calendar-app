import os

SECRET_KEY = b'\x10\x0c\xc2\x81\x82J\xb6\xff\xf2\xa6k\xf4a\x90\xef\xcc'

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True

SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]

SQLALCHEMY_TRACK_MODIFICATIONS = False
