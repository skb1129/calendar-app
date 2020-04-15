from flask import abort

from .models import Schedule, Event


def validate_event(event):
    if event.start_time >= event.end_time:
        return abort(400, "BAD_REQUEST: \"endTime\" should be after \"startTime\".")
    schedule = Schedule.query.get(event.user_id)
    if not schedule:
        return abort(404, "NOT_FOUND: No schedule found for this user.")
    if event.date.weekday() not in schedule.days_available:
        return abort(406, "NOT_ACCEPTABLE: The weekday is not available in the user's schedule.")
    if event.start_time < schedule.start_time or event.end_time > schedule.end_time:
        return abort(406, "NOT_ACCEPTABLE: The selected time slot is not available in the schedule.")
    events = Event.query.filter_by(date=event.date).filter_by(user_id=event.user_id).all()
    if not len(events):
        return True
    similar_events = []
    for other_event in events:
        if other_event.start_time >= event.end_time > event.start_time:
            continue
        if other_event.end_time <= event.start_time < event.end_time:
            continue
        similar_events.append(other_event)
    if len(similar_events):
        return abort(406, "NOT_ACCEPTABLE: This event conflicts with an existing event.")
    return True


def validate_schedule(schedule):
    if not schedule.days_available:
        return abort(400, "BAD_REQUEST: \"daysAvailable\" not provided.")
    if schedule.start_time >= schedule.end_time:
        return abort(400, "BAD_REQUEST: \"endTime\" should be after \"startTime\".")
    if len(schedule.days_available) > 7:
        return abort(400, "BAD_REQUEST: Length of \"daysAvailable\" cannot be more than 7.")
    for weekday in schedule.days_available:
        if weekday > 6 or weekday < 0:
            return abort(400, "BAD_REQUEST: \"daysAvailable\" can only contain values from 0 to 6 (where 0 represents Monday).")
    return True
