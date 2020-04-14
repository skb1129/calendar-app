from flask import Flask, request, jsonify, abort
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError

from .auth import encode_auth_token, requires_auth
from .models import setup_db, User, db_drop_and_create_all, Schedule

app = Flask(__name__)
bcrypt = Bcrypt(app)
setup_db(app)
# db_drop_and_create_all()


@app.route("/register", methods=["POST"])
def register():
    user = User(
        username=request.json.get("username"),
        password=bcrypt.generate_password_hash(request.json.get("password")).decode("UTF-8"),
        email=request.json.get("email")
    )
    try:
        user.insert()
    except IntegrityError as exception:
        return abort(400, "BAD_REQUEST: Unable to register user.")
    access_token = encode_auth_token(user.username)

    return jsonify({"success": True, "access_token": access_token}), 201


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:
        return abort(400, "BAD_REQUEST: \"username\" or \"password\" not provided.")
    user = User.query.filter_by(username=username).first()
    if not user:
        return abort(404, "NOT_FOUND: User not found")
    if not bcrypt.check_password_hash(user.password, password):
        return abort(409, "CONFLICT: Wrong Password")
    access_token = encode_auth_token(username)

    return jsonify({"success": True, "access_token": access_token}), 202


@app.route("/schedule", methods=["POST"])
@requires_auth
def save_schedule(user):
    schedule = Schedule(
        user_id=user.id,
        days_available=request.json.get("daysAvailable"),
        start_time=request.json.get("startTime"),
        end_time=request.json.get("endTime")
    )
    try:
        schedule.insert()
    except IntegrityError as exception:
        return abort(400, "BAD_REQUEST: Unable to save schedule.")

    return jsonify({"success": True}), 200


@app.route("/schedule", methods=["PUT"])
@requires_auth
def update_schedule(user):
    schedule = Schedule.query.get(user.id)
    if not schedule:
        return abort(404, "NOT_FOUND: No schedule found for this user.")
    days_available = request.json.get("daysAvailable", None)
    start_time = request.json.get("startTime", None)
    end_time = request.json.get("endTime", None)
    if days_available:
        schedule.days_available = days_available
    if start_time:
        schedule.start_time = start_time
    if end_time:
        schedule.end_time = end_time
    schedule.update()

    return jsonify({"success": True}), 200


@app.route("/schedule", methods=["GET"])
@requires_auth
def get_schedule(user):
    schedule = Schedule.query.get(user.id)
    if not schedule:
        return abort(404, "NOT_FOUND: No schedule found for this user.")
    return jsonify({"success": True, "schedule": schedule.dictionary()}), 200


if __name__ == '__main__':
    app.run()
