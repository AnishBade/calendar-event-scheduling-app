// components/Modal.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    if (!isOpen) return null;


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to create an event');
            return;
        }

        try {
            const selectedDateString=selectedDate.toDate().toISOString()
            let match = selectedDateString.match(/^(\d{4}-\d{2}-\d{2}T)\d{2}:\d{2}:\d{2}(\.000Z)$/);
            let eventStartTime = `${match[1]}${startTime}.111Z`
            let eventEndTime = `${match[1]}${endTime}.111Z`
            console.log('start_time',eventStartTime)
            console.log('end_time',eventEndTime)
            console.log('match',match);
            const response = await axios.post(
                'http://localhost:8000/api/event/events/',
                {
                    title: title,
                    start_time : eventStartTime,
                    end_time : eventEndTime,
                    description: description,

                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            if (response.status === 201) {
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating event', error);
            alert('Failed to create event');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Create Event</h2>
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
                            value={startTime}
                            placeholder='HH:MM:SS'
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">End Time</label>
                        <input
                            type="text"
                            value={endTime}
                            placeholder='HH:MM:SS'
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
                        Create
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

export default Modal;
