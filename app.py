from flask import Flask, request, jsonify, abort, make_response, render_template
from datetime import date, time
from flask_bcrypt import Bcrypt
from jinja2 import TemplateNotFound
from werkzeug.exceptions import InternalServerError

from .auth import encode_auth_token, requires_auth
from .models import setup_db, User, Schedule, Event, db_drop_and_create_all
from .services import validate_schedule, validate_event

app = Flask(__name__, static_url_path="")
bcrypt = Bcrypt(app)
setup_db(app)

db_drop_and_create_all()


@app.errorhandler(404)
def catch_all(e):
    try:
        render = render_template("index.html")
    except TemplateNotFound as exception:
        return e
    return render, 200


@app.route("/api/register", methods=["POST"])
def register():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:
        return abort(
            make_response(jsonify(code="BAD_REQUEST", message="\"username\" or \"password\" not provided."), 400))
    user = User(
        username=username,
        password=bcrypt.generate_password_hash(password).decode("UTF-8"),
        email=request.json.get("email"),
        first_name=request.json.get("firstName"),
        last_name=request.json.get("lastName")
    )
    user.insert()
    access_token = encode_auth_token(user.username)

    return jsonify({"success": True, "accessToken": access_token, "user": user.dictionary()}), 201


@app.route("/api/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:
        return abort(
            make_response(jsonify(code="BAD_REQUEST", message="\"username\" or \"password\" not provided."), 400))
    user = User.get_by_username(username)
    if not bcrypt.check_password_hash(user.password, password):
        return abort(make_response(jsonify(code="NOT_ACCEPTABLE", message="Wrong Password"), 406))
    access_token = encode_auth_token(username)

    return jsonify({"success": True, "accessToken": access_token, "user": user.dictionary()}), 202


@app.route("/api/check-auth", methods=["POST"])
@requires_auth
def check_auth(user):
    return jsonify({"success": True, "user": user.dictionary()}), 202


@app.route("/api/schedule", methods=["POST"])
@requires_auth
def save_schedule(user):
    start_time = request.json.get("startTime")
    end_time = request.json.get("endTime")
    if not start_time or not end_time:
        return abort(
            make_response(jsonify(code="BAD_REQUEST", message="\"startTime\" or \"endTime\" not provided."), 400))
    schedule = Schedule(
        user_id=user.id,
        days_available=request.json.get("daysAvailable"),
        start_time=time.fromisoformat(start_time),
        end_time=time.fromisoformat(end_time)
    )
    validate_schedule(schedule)
    schedule.insert()

    return jsonify({"success": True}), 201


@app.route("/api/schedule", methods=["PUT"])
@requires_auth
def update_schedule(user):
    schedule = Schedule.query.get(user.id)
    if not schedule:
        return abort(make_response(jsonify(code="NOT_FOUND", message="No schedule found for this user."), 404))
    days_available = request.json.get("daysAvailable")
    start_time = request.json.get("startTime")
    end_time = request.json.get("endTime")
    if days_available:
        schedule.days_available = days_available
    if start_time:
        schedule.start_time = time.fromisoformat(start_time)
    if end_time:
        schedule.end_time = time.fromisoformat(end_time)
    validate_schedule(schedule)
    schedule.update()

    return jsonify({"success": True}), 200


@app.route("/api/schedule", methods=["GET"])
@requires_auth
def get_schedule(user):
    schedule = Schedule.query.get(user.id)
    if not schedule:
        return jsonify({"success": True, "schedule": {}}), 204
    return jsonify({"success": True, "schedule": schedule.dictionary()}), 200


@app.route("/api/event", methods=["POST"])
def create_event():
    event_date = request.json.get("date")
    username = request.json.get("username")
    start_time = request.json.get("startTime")
    end_time = request.json.get("endTime")
    if not event_date or not username or not start_time or not end_time:
        return abort(make_response(jsonify(code="BAD_REQUEST", message="Provide all required parameters."), 400))
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


@app.route("/api/event", methods=["GET"])
@requires_auth
def get_events_for_user(user):
    events = [event.dictionary() for event in Event.query.filter_by(user_id=user.id).all()]
    if not len(events):
        return jsonify({"success": True, "events": []}), 204
    return jsonify({"success": True, "events": events}), 200


@app.route("/api/event", methods=["DELETE"])
@requires_auth
def delete_event(user):
    event_id = request.args.get("id")
    if not id:
        abort(make_response(jsonify(code="BAD_REQUEST", message="Event ID not provided."), 400))
    event = Event.query.get(event_id)
    if not event:
        abort(make_response(jsonify(code="NOT_FOUND", message=f"No event found with id: {event_id}."), 404))
    if event.user_id != user.id:
        abort(make_response(jsonify(code="FORBIDDEN", message="This event cannot be modified by you."), 403))
    event.delete()
    return jsonify({"success": True}), 200


@app.errorhandler(InternalServerError)
def server_error(error):
    return jsonify(code="SERVER_ERROR", message="An internal server error occurred."), error.code


if __name__ == '__main__':
    app.run()
