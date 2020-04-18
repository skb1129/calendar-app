import os

SECRET_KEY = os.urandom(32)

basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True

SQLALCHEMY_DATABASE_URI = "postgresql://kbthjwbmiitxup:42424862986ca4d7140a5978da9cb2a46107ef135c22b2d400394629308bba92@ec2-18-210-51-239.compute-1.amazonaws.com:5432/d5ua9i6m4tsfbs"

SQLALCHEMY_TRACK_MODIFICATIONS = False
