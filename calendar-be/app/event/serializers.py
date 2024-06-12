"""
Serializers for event APIs
"""

from rest_framework import serializers
from core.models import Event


class EventSerializer(serializers.ModelSerializer):
    """Serializer for events."""

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "start_time",
            "end_time",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        """Create an Event."""
        print("validated_data", validated_data)
        event = Event.objects.create(**validated_data)
        print("event", event)
        return event

    def update(self, instance, validated_data):
        """Update Event."""
        print("update")
        print("instance", instance)
        print("validated_data", validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def validate(self, data):
        # Check for event overlap
        user = self.context["request"].user
        start_time = data["start_time"]
        end_time = data["end_time"]
        overlapping_events = Event.objects.filter(
            user=user,
            end_time__gt=start_time,  # End time is after the new event's start time
            start_time__lt=end_time,  # Start time is before the new event's end time
        ).exclude(
            id=(
                self.instance.id if self.instance else None
            )  # Exclude the current event if updating
        )

        if overlapping_events.exists():
            raise serializers.ValidationError(
                "An event already exists within the specified time range."
            )

        return data


class EventDetailSerializer(EventSerializer):
    """Serializer for event detail view."""

    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ["description"]
