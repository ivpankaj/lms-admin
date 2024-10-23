import React, { useState } from 'react';
import CreateCourse from '../components/course/CreateCourse';
import CourseList from '../components/course/CourseList';

const CreateCoursePage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('createCourse');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'createCourse':
        return <CreateCourse />;
      case 'Get All Course':
        return <CourseList />;
      default:
        return <CreateCourse />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Course Management</h1>
      <div className="flex flex-wrap justify-center mb-8 space-y-4 sm:space-y-0">
        <button
          className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'CreateCourse' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setActiveComponent('CreateCourse')}
        >
          Create Course     
       </button>
        <button
          className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'Get All Course' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setActiveComponent('Get All Course')}
        >
          Get All Course
        </button>
      </div>

      <div className="mt-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default CreateCoursePage;
