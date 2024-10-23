import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { getApiUrl } from '../../env';

// const api = import.meta.env.VITE_API_URL;

const CreateTopic: React.FC = () => {

  const token = Cookies.get('authToken');
  const api = getApiUrl();

  const [title, setTitle] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<{ id: string, name: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${api}/api/admin/course/getall`, {
          headers: {
            'Authorization': `${token}`, // Assuming Bearer token is used
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.data.data); // Adjust according to your API response structure
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch courses');
        }
      } catch (error) {
        setErrorMessage('An error occurred');
      }
    };

    fetchCourses();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Course name is required');
      return;
    }

    if (!selectedCourseId) {
      setErrorMessage('Please select a course');
      return;
    }

    try {
      const response = await fetch(`${api}/api/admin/topic/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Assuming Bearer token is used
        },
        body: JSON.stringify({ topic: title, courseId: selectedCourseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to create topic');
      } else {
        setTitle(''); // Clear the input
        setSelectedCourseId(null); // Clear the selected course
        setSuccessMessage('Topic created successfully');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <div 
    //   className="mb-5 flex flex-col gap-5 sm:flex-row"
      >
     

        <div className="w-full sm:w-1/1">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="courseSelect"
          >
            Select Course
          </label>
          <select
            id="courseSelect"
            className="w-full rounded-3xl border border-gray-300 bg-gray-50 py-3 px-4 text-black focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-300"
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/1">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="courseName"
          >
            Topic Name
          </label>
          <div className="relative">
            <span className="absolute left-4 top-4">
              <FaBook />
            </span>
            <input
              className="w-full rounded-3xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-300"
              type="text"
              id="courseName"
              placeholder="Enter topic name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mt-2">{successMessage}</p>
      )}
      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Create Topic
      </button>
    </form>
  );
};

export default CreateTopic;
