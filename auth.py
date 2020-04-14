import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request

from .config import SECRET_KEY
from .models import User


def encode_auth_token(username):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            "exp": datetime.utcnow() + timedelta(days=1),
            "iat": datetime.utcnow(),
            "sub": username
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256").decode("UTF-8")
    except Exception as e:
        return e


def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token: JWT Token
    :return: string
    """
    try:
        payload = jwt.decode(auth_token, SECRET_KEY)
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return "Signature expired. Please log in again."
    except jwt.InvalidTokenError:
        return "Invalid token. Please log in again."


def get_token_auth_header():
    auth = request.headers.get('Authorization', None)
    return auth.split()[1]


def get_user_from_token(token):
    username = decode_auth_token(token)
    user = User.query.get(username=username)
    return user


def requires_auth(permission=''):
    """
    Creates and returns a decorator for authentication
    :param permission: Required permission
    :return: requires_auth_decorator: Authentication decorator
    """

    def requires_auth_decorator(f):
        """
        :param f: Function to be wrapped
        :return: wrapper: Wrapper function
        """

        @wraps(f)
        def wrapper(*args, **kwargs):
            """
            This function validates and checks permission from the JWT
            It throws an AuthError exception if permission do not match or the JWT is invalid
            :return: f: Wrapped function with decoded JWT payload
            """
            token = get_token_auth_header()
            user = get_user_from_token(token)
            return f(user, *args, **kwargs)

        return wrapper

    return requires_auth_decorator
