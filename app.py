from flask import Flask, request, jsonify, abort
from datetime import date, time
from flask_bcrypt import Bcrypt

from .auth import encode_auth_token, requires_auth
from .models import setup_db, User, Schedule, Event, db_drop_and_create_all
from .services import validate_schedule, validate_event

app = Flask(__name__)
bcrypt = Bcrypt(app)
setup_db(app)
# db_drop_and_create_all()


@app.route("/register", methods=["POST"])
def register():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:
        return abort(400, "BAD_REQUEST: \"username\" or \"password\" not provided.")
    user = User(
        username=username,
        password=bcrypt.generate_password_hash(password).decode("UTF-8"),
        email=request.json.get("email")
    )
    user.insert()
    access_token = encode_auth_token(user.username)

    return jsonify({"success": True, "access_token": access_token}), 201


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:
        return abort(400, "BAD_REQUEST: \"username\" or \"password\" not provided.")
    user = User.get_by_username(username)
    if not bcrypt.check_password_hash(user.password, password):
        return abort(406, "NOT_ACCEPTABLE: Wrong Password")
    access_token = encode_auth_token(username)

    return jsonify({"success": True, "access_token": access_token}), 202


@app.route("/schedule", methods=["POST"])
@requires_auth
def save_schedule(user):
    start_time = request.json.get("startTime")
    end_time = request.json.get("endTime")
    if not start_time or not end_time:
        return abort(400, "BAD_REQUEST: \"startTime\" or \"endTime\" not provided.")
    schedule = Schedule(
        user_id=user.id,
        days_available=request.json.get("daysAvailable"),
        start_time=time.fromisoformat(start_time),
        end_time=time.fromisoformat(end_time)
    )
    validate_schedule(schedule)
    schedule.insert()

    return jsonify({"success": True}), 201


@app.route("/schedule", methods=["PUT"])
@requires_auth
def update_schedule(user):
    schedule = Schedule.query.get(user.id)
    if not schedule:
        return abort(404, "NOT_FOUND: No schedule found for this user.")
    days_available = request.json.get("daysAvailable")
    start_time = request.json.get("startTime")
    end_time = request.json.get("endTime")
    if days_available:
        schedule.days_available = days_available
    if start_time:
        schedule.start_time = start_time
    if end_time:
        schedule.end_time = end_time
    validate_schedule(schedule)
    schedule.update()

    return jsonify({"success": True}), 200


@app.route("/schedule", methods=["GET"])
@requires_auth
def get_schedule(user):
    schedule = Schedule.query.get(user.id)
    if not schedule:
        return abort(404, "NOT_FOUND: No schedule found for this user.")
    return jsonify({"success": True, "schedule": schedule.dictionary()}), 200


@app.route("/event", methods=["POST"])
def create_event():
    event_date = request.json.get("date")
    username = request.json.get("username")
    start_time = request.json.get("startTime")
    end_time = request.json.get("endTime")
    if not event_date or not username or not start_time or not end_time:
        return abort(400, "BAD_REQUEST: Provide all required parameters.")
    user = User.get_by_username(username)
    event = Event(
        name=request.json.get("name"),
        guest_emails=request.json.get("guestEmails"),
        description=request.json.get("description"),
        date=date.fromisoformat(event_date),
        start_time=time.fromisoformat(start_time),
        end_time=time.fromisoformat(end_time),
        user_id=user.id
    )
    validate_event(event)
    event.insert()

    return jsonify({"success": True}), 201


@app.route("/event", methods=["GET"])
@requires_auth
def get_events_for_user(user):
    events = [event.dictionary() for event in Event.query.filter_by(user_id=user.id).all()]
    return jsonify({"success": True, "events": events}), 200


if __name__ == '__main__':
    app.run()
