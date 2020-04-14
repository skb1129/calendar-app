from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, ForeignKey, Time, ARRAY, Date

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

    def insert(self):
        db.session.add(self)
        db.session.commit()


class Schedule(db.Model):
    """
    Persistent schedule entity, extends the base SQLAlchemy model.
    """
    __tablename__ = "schedule"

    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    days_available = Column(ARRAY(String), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    def insert(self):
        db.session.add(self)
        db.session.commit()


class Event(db.Model):
    """
    Persistent event entity, extends the base SQLAlchemy model.
    """
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))

    def insert(self):
        db.session.add(self)
        db.session.commit()