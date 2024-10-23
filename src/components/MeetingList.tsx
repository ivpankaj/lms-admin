import React, { useEffect, useState } from 'react';
import { deleteMeeting, getMeetings, updateMeeting } from './meetingService';

interface Meeting {
  id: number;
  title: string;
  description: string;
  link: string;
}

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    const data = await getMeetings();
    setMeetings(data);
  };

  const handleDelete = async (id: number) => {
    await deleteMeeting(id);
    fetchMeetings();
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setTitle(meeting.title);
    setDescription(meeting.description);
    setLink(meeting.link);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeeting) {
      await updateMeeting(editingMeeting.id, { title, description, link });
      setEditingMeeting(null);
      setTitle('');
      setDescription('');
      setLink('');
      fetchMeetings();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Meeting List</h2>
      <ul>
        {meetings.map((meeting) => (
          <li key={meeting.id} className="mb-2 border p-2">
            <div>
              <strong>Title:</strong> {meeting.title}
            </div>
            <div>
              <strong>Description:</strong> {meeting.description}
            </div>
            <div>
              <strong>Link:</strong>{' '}
              <a
                href={meeting.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {meeting.link}
              </a>
            </div>
            <button
              onClick={() => handleEdit(meeting)}
              className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(meeting.id)}
              className="bg-red-500 text-white px-2 py-1 mt-2 rounded ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editingMeeting && (
        <form onSubmit={handleUpdate} className="mt-4 border p-4">
          <h3 className="text-lg font-bold mb-2">Edit Meeting</h3>
          <button
            type="button"
            onClick={() => setEditingMeeting(null)}
            className="bg-gray-500 text-black px-4 py-2 rounded mb-2"
          >
            Close
          </button>
          <div>
            <label className="block mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Link:</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default MeetingList;
