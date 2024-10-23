import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FaEdit, FaTrash, FaExclamation, FaBook } from 'react-icons/fa';
import { getApiUrl } from '../../env';
import useConfirmationDialog from '../ConfirmBox/useConfirmationDialouge';

// const api = import.meta.env.VITE_API_URL;

interface Course {
  id: number;
  name: string;
}

const CourseList: React.FC = () => {

  const api = getApiUrl();

  const [courses, setCourses] = useState<Course[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourseName, setNewCourseName] = useState<string>('');

  const token = Cookies.get('authToken');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${api}/api/admin/course/getall`, {
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

  const handleUpdate = async (course: Course) => {
    if (!newCourseName.trim()) {
      setErrorMessage('New course name is required');
      return;
    }

    try {
      const response = await fetch(`${api}/api/admin/course/update/${course.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ name: newCourseName }),
      });

      if (response.ok) {
        setSuccessMessage('Course updated successfully');
        setEditingCourse(null);
        setNewCourseName('');
        fetchCourses();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update course');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  //delete 
  const { openDialog, Dialog } = useConfirmationDialog();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = (id: any) => {
    setShowDeleteDialog(true);
    openDialog('Are you sure you want to delete this item?', () => {
      // Perform the delete action here
      handleDeleteConfirmation(id)
    });
  };

  const handleDeleteConfirmation = async (id: number) => {
    try {
      const response = await fetch(`${api}/api/admin/course/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('Course deleted successfully');
        fetchCourses();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to delete course');
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
      <h1 className="text-xl font-bold mb-4">Course List</h1>
      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
      <ul className="space-y-4">
        {courses.map((course: any) => (
          <li key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <span className="flex items-center">
              <FaBook className="mr-2 text-blue-500" />
              {course.name}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingCourse(course)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>


      {
        showDeleteDialog && <Dialog />
      }

      {editingCourse && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Edit Course</h2>
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="New course name"
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          />
          <button
            onClick={() => handleUpdate(editingCourse)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Update Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseList;
