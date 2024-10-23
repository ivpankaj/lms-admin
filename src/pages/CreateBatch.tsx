
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getApiUrl } from '../env';

interface Course {
  id: number;
  name: string;
}

const CreateBatch: React.FC = () => {
  const apiUrl = getApiUrl();
  const token = Cookies.get('authToken');

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [totalStudent, setTotalStudent] = useState<number | ''>(0);
  const [remainingStudent, setRemainingStudent] = useState<number | ''>(0);
  const [batchName, setBatchName] = useState<string>('');
  const [RegistrationStartDate, setRegistrationStartDate] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/course/getall`, {
          headers: {
            'Authorization': `${token}`,
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

    fetchCourses();
  }, [apiUrl, token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if any field is empty
    if (selectedCourse === null || totalStudent === '' || remainingStudent === '' || !batchName || !RegistrationStartDate) {
      setErrorMessage('All fields are required and must be valid.');
      return;
    }

    // Validate values
    if (typeof totalStudent === 'number' && typeof remainingStudent === 'number') {
      if (remainingStudent > totalStudent) {
        setErrorMessage('Remaining Students must be less than or equal to Total Students.');
        return;
      }
    }

    // Validate Registration Date
    const currentDate = new Date().toISOString().split('T')[0];
    if (RegistrationStartDate < currentDate) {
      setErrorMessage('Registration Start Date cannot be in the past.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/admin/batch/create`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          totalStudent,
          remainingStudent,
          batchName,
          RegistrationStartDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Batch created successfully.');
        // Reset form
        setSelectedCourse(null);
        setTotalStudent('');
        setRemainingStudent('');
        setBatchName('');
        setRegistrationStartDate('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to create batch');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Create Batch</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2">
            Select Course <span className="text-red-600">*</span>:
          </label>
          <select
            className="block w-full p-2 border border-gray-300 rounded-lg"
            value={selectedCourse ?? ''}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">
            Total Students <span className="text-red-600">*</span>:
          </label>
          <input
            type="number"
            min="0"
            className="block w-full p-2 border border-gray-300 rounded-lg"
            value={totalStudent}
            onChange={(e) => setTotalStudent(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">
            Remaining Students <span className="text-red-600">*</span>:
          </label>
          <input
            type="number"
            min="0"
            className="block w-full p-2 border border-gray-300 rounded-lg"
            value={remainingStudent}
            onChange={(e) => setRemainingStudent(e.target.value === '' ? '' : Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">
            Batch Name <span className="text-red-600">*</span>:
          </label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-300 rounded-lg"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">
            Registration Start Date <span className="text-red-600">*</span>:
          </label>
          <input
            type="date"
            className="block w-full p-2 border border-gray-300 rounded-lg"
            value={RegistrationStartDate}
            onChange={(e) => setRegistrationStartDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Create Batch
        </button>
      </form>
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
    </div>
  );
};

export default CreateBatch;
