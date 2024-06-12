# from app.utils.config import settings

from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from core.models import User
from utils.email.sender import SendEmail
from django.contrib.auth import get_user_model
from django.db import models


class EventRepository:

    def send_event_reminder_email(self, user_name, user_email, event_title, event_start_time):
        next_step_link = "http://localhost:3000/detail/"
        html_template_path = "event_notification_email.html"
        template_data = {
            "sender": None,
            "subject": "Event Reminder !!!",
            "name": user_name,
            "all_recipients": [user_email],
            "path_to_html_template": html_template_path,
            "path_to_attachment_file": None,  # optional
            "next_step_link": next_step_link,
            "event_title": event_title,
            "event_start_time": event_start_time,
        }
        SendEmail().send_email(template_data=template_data)


