import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FaEdit, FaTrash, FaBook, FaExclamation } from 'react-icons/fa';
import { getApiUrl } from '../../env';

// const api = import.meta.env.VITE_API_URL;

interface Course {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
}

const TopicList: React.FC = () => {

  const api = getApiUrl();

  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [newTopicName, setNewTopicName] = useState<string>('');

  const token = Cookies.get('authToken');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId !== null) {
      fetchTopics(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${api}/api/admin/course/getall`, {
        headers: {
          'Authorization': `${token}`, // Adjust according to your API's authentication method
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data.data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch courses');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  const fetchTopics = async (courseId: number) => {
    try {

      const response = await fetch(`${api}/api/admin/topic/getall/${courseId}`, {
        headers: {
          'Authorization': `${token}`, // Adjust according to your API's authentication method
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTopics(data.data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch topics');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  const handleUpdateTopic = async (topic: Topic) => {
    if (!newTopicName.trim()) {
      setErrorMessage('New topic name is required');
      return;
    }

    try {
      const response = await fetch(`${api}/api/admin/topic/update/${topic.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Adjust according to your API's authentication method
        },
        body: JSON.stringify({ name: newTopicName }),
      });

      if (response.ok) {
        setSuccessMessage('Topic updated successfully');
        setEditingTopic(null);
        setNewTopicName('');
        if (selectedCourseId !== null) {
          fetchTopics(selectedCourseId);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update topic');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  const handleDeleteTopic = async (id: number) => {
    try {
      const response = await fetch(`${api}/api/admin/topic/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`, // Adjust according to your API's authentication method
        },
      });

      if (response.ok) {
        setSuccessMessage('Topic deleted successfully');
        if (selectedCourseId !== null) {
          fetchTopics(selectedCourseId);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to delete topic');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {
        courses.length === 0 &&
        <div className='flex items-center justify-center text-[10rem] w-full h-full opacity-20 my-20'><FaExclamation /></div>
      }
      <h1 className="text-xl font-bold mb-4">Topic List</h1>

      {/* Dropdown for Course Selection */}
      <div className="mb-4">
        <label htmlFor="courseSelect" className="block text-sm font-medium text-black">
          Select Course
        </label>
        <select
          id="courseSelect"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          value={selectedCourseId ?? ''}
          onChange={(e) => setSelectedCourseId(Number(e.target.value))}
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

      <ul className="space-y-4">
        {topics.length > 0 ? topics.map((topic: any) => (
          <li key={topic.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <span className="flex items-center">
              <FaBook className="mr-2 text-blue-500" />
              {topic.topic}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingTopic(topic);
                  setNewTopicName(topic.name);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))
          : <>
            {selectedCourseId && <div>no topic found please go to create topic and create now</div>}
          </>
        }
      </ul>

      {editingTopic && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Edit Topic</h2>
          <input
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="New topic name"
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          />
          <button
            onClick={() => handleUpdateTopic(editingTopic)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Update Topic
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicList;
