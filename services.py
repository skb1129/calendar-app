from flask import abort, jsonify, make_response

from models import Schedule, Event


def validate_event(event):
    if event.start_time >= event.end_time:
        return abort(
            make_response(jsonify(code="BAD_REQUEST", message="\"endTime\" should be after \"startTime\"."), 400))
    schedule = Schedule.query.get(event.user_id)
    if not schedule:
        return abort(make_response(jsonify(code="NOT_FOUND", message="No schedule found for this user."), 404))
    if event.date.weekday() not in schedule.days_available:
        return abort(make_response(
            jsonify(code="NOT_ACCEPTABLE", message="The weekday is not available in the user's schedule."), 406))
    if event.start_time < schedule.start_time or event.end_time > schedule.end_time:
        return abort(make_response(
            jsonify(code="NOT_ACCEPTABLE", message="The selected time slot is not available in the schedule."), 406))
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
    if similar_events:
        return abort(
            make_response(jsonify(code="NOT_ACCEPTABLE", message="This event conflicts with an existing event."), 406))
    return True


def validate_schedule(schedule):
    if not schedule.days_available:
        return abort(make_response(jsonify(code="BAD_REQUEST", message="\"daysAvailable\" not provided."), 400))
    if schedule.start_time >= schedule.end_time:
        return abort(
            make_response(jsonify(code="BAD_REQUEST", message="\"endTime\" should be after \"startTime\"."), 400))
    if len(schedule.days_available) > 7:
        return abort(
            make_response(jsonify(code="BAD_REQUEST", message="Length of \"daysAvailable\" cannot be more than 7."),
                          400))
    for weekday in schedule.days_available:
        if weekday > 6 or weekday < 0:
            return abort(make_response(jsonify(code="BAD_REQUEST",
                                               message="\"daysAvailable\" can only contain values from 0 to 6 (where 0 represents Monday)."),
                                       400))
    return True
