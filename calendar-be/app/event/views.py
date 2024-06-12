"""
Views for the event APIs.
"""

from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from event.task_scheduler.schedule import schedule_event_reminder_email
from core.models import Event
from event import serializers

from event.repository import EventRepository


class EventViewSet(viewsets.ModelViewSet):
    """View for manage event APIs."""

    serializer_class = serializers.EventDetailSerializer
    queryset = Event.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("get_queryset")
        """Retrieve events for authenticated user."""
        return self.queryset.filter(user=self.request.user).order_by("-id")

    def get_serializer_class(self):
        print("get_serializer_class")
        """Return the serializer class for request."""
        if self.action == "list":
            return serializers.EventSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        """Create a new event."""
        print("serializer", serializer)
        print("serializer.validated_data", serializer.validated_data)
        print("self.request.user", self.request.user.email)
        serializer.save(user=self.request.user)
        schedule_event_reminder_email(
            user_instance=self.request.user,
            event_instance=serializer.data,
        )
