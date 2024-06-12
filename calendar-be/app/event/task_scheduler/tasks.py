from __future__ import absolute_import, unicode_literals
from event.repository import EventRepository
from app.celery import app

from celery import shared_task

@shared_task
def send_email_notification(user_name, user_email, event_title, event_start_time):
    # Set up the SMTP server and send the email
    EventRepository().send_event_reminder_email(user_name, user_email, event_title, event_start_time)