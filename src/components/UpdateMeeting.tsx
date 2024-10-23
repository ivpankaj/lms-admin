import React, { useEffect, useState } from 'react';
import { getMeetingById, updateMeeting } from './meetingService';


const UpdateMeeting: React.FC<{ meetingId: number }> = ({ meetingId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');

    const fetchMeeting = async () => {
        const meeting = await getMeetingById(meetingId);
        setTitle(meeting.title);
        setDescription(meeting.description);
        setLink(meeting.link);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateMeeting(meetingId, { title, description, link });
        alert('Meeting updated successfully');
    };

    useEffect(() => {
        fetchMeeting();
    }, [meetingId]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Update Meeting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Update
                </button>
            </form>
        </div>
    );
};

export default UpdateMeeting;
