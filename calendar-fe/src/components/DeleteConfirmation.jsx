// components/DeleteConfirmation.js
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteConfirmation = ({ isOpen, onClose, eventId, onDelete }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete an event');
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/event/events/${eventId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.status === 204) {
        onDelete(eventId);
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting event', error);
      alert('Failed to delete event');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this event?</p>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
