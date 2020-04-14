import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, abort

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
    except TypeError as exception:
        return exception


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
        return abort(401, "UNAUTHORIZED: Signature expired. Please log in again.")
    except jwt.InvalidTokenError:
        return abort(401, "UNAUTHORIZED: Invalid token. Please log in again.")


def get_user_from_token():
    auth = request.headers.get('Authorization', None)
    if not auth:
        return abort(400, "BAD_REQUEST: Authorization header is missing.")
    parts = auth.split()
    if parts[0].lower() != 'bearer':
        return abort(400, "BAD_REQUEST: Authorization header must start with Bearer.")
    if len(parts) != 2:
        return abort(401, "UNAUTHORIZED: Authorization header must be Bearer token.")
    token = parts[1]
    username = decode_auth_token(token)
    user = User.query.filter_by(username=username).first()
    if not user:
        return abort(401, "UNAUTHORIZED: Invalid user in the token header.")
    return user


def requires_auth(f):
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
        user = get_user_from_token()
        return f(user, *args, **kwargs)

    return wrapper
