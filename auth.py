import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, abort, jsonify, make_response

from config import SECRET_KEY
from models import User


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
        return abort(
            make_response(jsonify(code="UNAUTHORIZED", message="Signature expired. Please log in again."), 401))
    except jwt.InvalidTokenError:
        return abort(make_response(jsonify(code="UNAUTHORIZED", message="Invalid token. Please log in again."), 401))


def get_user_from_token():
    auth = request.headers.get('Authorization', None)
    if not auth:
        return abort(make_response(jsonify(code="BAD_REQUEST", message="Authorization header is missing."), 400))
    parts = auth.split()
    if parts[0].lower() != 'bearer':
        return abort(
            make_response(jsonify(code="BAD_REQUEST", message="Authorization header must start with Bearer."), 400))
    if len(parts) != 2:
        return abort(
            make_response(jsonify(code="UNAUTHORIZED", message="Authorization header must be Bearer token."), 401))
    token = parts[1]
    username = decode_auth_token(token)
    user = User.query.filter_by(username=username).first()
    if not user:
        return abort(make_response(jsonify(code="UNAUTHORIZED", message="Invalid user in the token header."), 401))
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
