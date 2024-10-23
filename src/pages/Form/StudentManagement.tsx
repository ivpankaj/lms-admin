// import { useState } from 'react';
import { useState } from 'react';
import CreateStudents from '../../components/Students/CreateStudents';
import StudentsList from '../../components/Students/StudentsList';

const StudentManagement = () => {
  // State to track which component to show
  const [view, setView] = useState<'create' | 'list'>('list');

  // Handlers for button clicks
  const handleCreateClick = () => {
    setView('create');
  };

  const handleListClick = () => {
    setView('list');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col gap-6">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Manage Students
            </h3>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCreateClick}
              type="button"
              className={` text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                view === 'create' ? 'bg-blue-700 text-white' : ''
              }`}
            >
              Create Student 
            </button>
            
            <button
              onClick={handleListClick}
              type="button"
              className={`bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ${
                view === 'list' ? 'bg-blue-600 text-white' : ''
              }`}
            >
              Get All Students
            </button>
          </div>
          
          {/* Display the selected component */}
          {view === 'create' && <CreateStudents />}
          {view === 'list' && <StudentsList />}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
