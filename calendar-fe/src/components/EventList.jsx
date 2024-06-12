// components/EventList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import EditModal from './EditModal';
import DeleteConfirmation from './DeleteConfirmation';

const EventList = ({ filterDate }) => {
  const [events, setEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setEvents([]);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/event/events/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const sortedEvents = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (eventId) => {
    setSelectedEvent({ id: eventId });
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (updatedEvent) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setIsEditModalOpen(false);
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsDeleteModalOpen(false);
  };

  const filteredEvents = filterDate
    ? events.filter(event => dayjs(event.date).isSame(filterDate, 'day'))
    : events;

    console.log('filteredEvents',filteredEvents)
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Your Events</h2>
      {filteredEvents.length === 0 ? (
        <p className="text-gray-400">No events found.</p>
      ) : (
        <ul className="list-disc ml-5">

          {filteredEvents.map((event) => (
            <li key={event.id} className="mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="block">{event.title}</strong>
                  <span className="text-sm text-gray-600">
                    {dayjs(event.start_time).format('MMMM D, YYYY')} {dayjs(event.start_time).format('h:mm A')} - {dayjs(event.end_time).format('h:mm A')}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handleEditClick(event)}
                    className="text-blue-500 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(event.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {event.description && (
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          event={selectedEvent}
          onUpdate={handleUpdate}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          eventId={selectedEvent.id}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EventList;
