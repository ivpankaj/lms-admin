
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { BRAND } from '../../types/brand'; // Ensure this is the correct type for your data
import { getApiUrl } from '../../env';

const TableOne = () => {
  const apiUrl = getApiUrl();
  const [students, setStudents] = useState<BRAND[]>([]);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const[totalStudents,setTotalStudents] = useState<number | null>(null);

  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/course/getall`, {
          method: 'get',
          headers: {
            'authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.data.data); // Assuming the API response has a 'courses' field
      } catch (error: any) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [apiUrl, token]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const courseQuery = selectedCourse ? `&courseId=${selectedCourse}` : '';
        const response = await fetch(`${apiUrl}/api/admin/student/getAll?search=${searchQuery}&page=${page}${courseQuery}`, {
          method: 'get',
          headers: {
            'authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          setError('No Student Found');
          setStudents([]);
          setTotalStudents(0);
          return;
        }
        const data = await response.json();
        setTotalStudents(data.data.totalStudents)
        setStudents(data.data.students);
        setTotalPages(data.data.totalPages); // Assuming the backend sends this info
      } catch (error: any) {
        setError('No student found');
        setTotalStudents(0)
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [apiUrl, token, searchQuery, page, selectedCourse]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page on course change
  };

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-3xl border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-boxdark lg:p-8">
      <h4 className="mb-4 text-lg font-semibold text-black dark:text-white sm:mb-6 sm:text-xl">
        Students List
      </h4>
  
      <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="p-2 border rounded w-full sm:w-1/2"
        />
  
        <select
          value={selectedCourse || ''}
          onChange={handleCourseChange}
          className="p-2 border rounded w-full sm:w-1/2"
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
  
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-black dark:text-white sm:text-xl">
          Total Students
        </h4>
        <div className="text-xl font-bold text-black dark:text-white">
          {totalStudents}
        </div>
      </div>
  
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 rounded-3xl bg-gray-100 dark:bg-meta-4 sm:grid-cols-5 sm:gap-6">
          <div className="p-2 text-center sm:p-4">
            <h5 className="text-xs font-medium uppercase text-gray-700 dark:text-gray-300 sm:text-sm">
              ID
            </h5>
          </div>
          <div className="p-2 text-left sm:p-4">
            <h5 className="text-xs font-medium uppercase text-gray-700 dark:text-gray-300 sm:text-sm">
              Name
            </h5>
          </div>
          <div className="p-2 text-left sm:p-4">
            <h5 className="text-xs font-medium uppercase text-gray-700 dark:text-gray-300 sm:text-sm">
              Course Name
            </h5>
          </div>
          <div className="p-2 text-center sm:p-4 sm:col-span-2 lg:col-span-1">
            <h5 className="text-xs font-medium uppercase text-gray-700 dark:text-gray-300 sm:text-sm">
              Actions
            </h5>
          </div>
        </div>
  
        {students.length > 0 ? students.map((student, index) => (
          <div
            className="grid grid-cols-3 gap-4 items-center border-b border-stroke dark:border-strokedark sm:grid-cols-5 sm:gap-6 last:border-none"
            key={student.id}
          >
            <p className="text-center text-sm text-black dark:text-white">
              {index + 1}
            </p>
            <div className="flex items-center gap-2 p-2 sm:gap-3 sm:p-4">
              <img src={`${apiUrl}${student.studentProfile}`} alt={student.name} className="h-8 w-8 rounded-full" />
              <p className="text-sm text-black dark:text-white">{student.name}</p>
            </div>
            <p className="text-sm text-black dark:text-white">{student.courseName}</p>
            <div className="flex items-center justify-center p-2 sm:p-4 sm:col-span-2 lg:col-span-1">
              <Link to={`/profile/${student.id}`}>
                <button className="text-blue-500 text-sm hover:underline">
                  View details
                </button>
              </Link>
            </div>
          </div>
        )) : <div className="text-center text-black dark:text-white">No students found</div>}
  
        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default TableOne;
