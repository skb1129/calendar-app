from flask import abort, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, ForeignKey, Time, ARRAY, Date, Text
from sqlalchemy.exc import IntegrityError

db = SQLAlchemy()


def setup_db(app):
    """
    Binds a flask application and a SQLAlchemy service
    :param app: Flask app instance
    :return:
    """
    app.config.from_object('config')
    db.app = app
    db.init_app(app)


def db_drop_and_create_all():
    """
    Drops the database tables and starts fresh
    Can be used to initialize a clean database
    NOTE:  Dou can change the "database_filename" variable to have multiple versions of a database
    :return:
    """
    db.drop_all()
    db.create_all()


class User(db.Model):
    """
    Persistent user entity, extends the base SQLAlchemy model.
    """
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(80), nullable=False, unique=True)
    password = Column(String(128), nullable=False)
    email = Column(String(80))
    first_name = Column(String(80))
    last_name = Column(String(80))

    def insert(self):
        try:
            db.session.add(self)
            db.session.commit()
        except IntegrityError as exception:
            return abort(make_response(jsonify(code="BAD_REQUEST", message="Unable to register user."), 400))

    def update(self):
        try:
            db.session.commit()
        except IntegrityError as exception:
            return abort(make_response(jsonify(code="BAD_REQUEST", message="Unable to update user."), 400))

    def dictionary(self):
        return {
            "username": self.username,
            "email": self.email,
            "firstName": self.first_name,
            "lastName": self.last_name
        }

    @staticmethod
    def get_by_username(username):
        user = User.query.filter_by(username=username).first()
        if not user:
            return abort(make_response(jsonify(code="NOT_FOUND", message="User not found"), 404))
        return user


class Schedule(db.Model):
    """
    Persistent schedule entity, extends the base SQLAlchemy model.
    """
    __tablename__ = "schedule"

    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    days_available = Column(ARRAY(Integer), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    def insert(self):
        try:
            db.session.add(self)
            db.session.commit()
        except IntegrityError as exception:
            return abort(make_response(jsonify(code="BAD_REQUEST", message="Unable to save schedule."), 400))

    def update(self):
        try:
            db.session.commit()
        except IntegrityError as exception:
            return abort(make_response(jsonify(code="BAD_REQUEST", message="Unable to update schedule."), 400))

    def dictionary(self):
        return {
            "daysAvailable": self.days_available,
            "startTime": self.start_time.isoformat(),
            "endTime": self.end_time.isoformat()
        }


class Event(db.Model):
    """
    Persistent event entity, extends the base SQLAlchemy model.
    """
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)
    name = Column(String(80), nullable=False)
    guest_emails = Column(ARRAY(String(80)), nullable=False)
    description = Column(Text)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))

    def insert(self):
        try:
            db.session.add(self)
            db.session.commit()
        except IntegrityError as exception:
            return abort(make_response(jsonify(code="BAD_REQUEST", message="Unable to create event."), 400))

    def update(self):
        try:
            db.session.commit()
        except IntegrityError as exception:
            return abort(make_response(jsonify(code="BAD_REQUEST", message="Unable to update event."), 400))

    def dictionary(self):
        return {
            "name": self.name,
            "guestEmails": self.guest_emails,
            "description": self.description,
            "date": self.date.strftime("%x"),
            "startTime": self.start_time.isoformat(),
            "endTime": self.end_time.isoformat()
        }
