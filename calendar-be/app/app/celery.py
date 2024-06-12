from __future__ import absolute_import, unicode_literals

from celery import Celery

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

broker_url = os.environ.get('CELERY_BROKER_URL', 'pyamqp://rabbitmq:rabbitmq@rabbitmq3:5672//')
backend_url = os.environ.get('CELERY_BACKEND_URL', 'rpc://')

app = Celery("app", broker=broker_url, backend=backend_url)

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
# app.conf.update(
#     result_backend="rpc://",
#     task_serializer="json",
#     accept_content=["json"],
#     result_serializer="json",
#     timezone="UTC",
#     enable_utc=True,
# )
