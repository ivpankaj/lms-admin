import React, { useEffect, useState } from 'react';
import { createMeeting } from './meetingService';
import { getApiUrl } from '../env';
import Cookies from 'js-cookie';

const apiUrl = getApiUrl();
const token = Cookies.get('authToken');

interface Course {
    courseId: number;
  name: string;
  id: number;
}

const CreateMeeting: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/course/getall`, {
          method: 'GET',
         
        });
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.data.data || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse === '') {
      alert('Please select a course');
      return;
    }

    try {
      await createMeeting({
        courseId: selectedCourse,
        title,
        description,
        link,
      });
      setTitle('');
      setDescription('');
      setLink('');
      setSelectedCourse('');
      alert('Meeting created successfully');
    } catch (error) {
      console.error('Failed to create meeting:', error);
      alert('Failed to create meeting. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create Meeting</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          id="CourseID"
          className="w-full rounded-3xl border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
          required
        >
          <option value="">Select a course</option>
          {courses.length > 0 ? (
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))
          ) : (
            <option disabled>No courses available</option>
          )}
        </select>
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateMeeting;
