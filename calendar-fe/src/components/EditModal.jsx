// components/EditModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditModal = ({ isOpen, onClose, event, onUpdate }) => {
  const [title, setTitle] = useState(event.title);
  const [startTime, setStartTime] = useState(event.start_time);
  const [endTime, setEndTime] = useState(event.end_time);
  const [description, setDescription] = useState(event.description);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to edit an event');
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/event/events/${event.id}/`,
        {
          title,
          start_time: startTime,
          end_time: endTime,
          description,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.status === 200) {
        onUpdate(response.data);
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error editing event', error);
      alert('Failed to edit event');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Start Time</label>
            <input
              type="text"
              placeholder='HH:MM:SS'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">End Time</label>
            <input
              type="text"
              placeholder='HH:MM:SS'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
