import React, { useState } from 'react';
import CreateTopic from '../components/courseTopic/CreateTopic';
import TopicList from '../components/courseTopic/TopicAllList';

const CreateTopicPage: React.FC = () => {

  const [activeComponent, setActiveComponent] = useState<string>('createtopic');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'createtopic':
        return <CreateTopic />;
      case 'Get All Topic':
        return <TopicList />;
      default:
        return <CreateTopic />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Topic Management</h1>
      <div className="flex flex-wrap justify-center mb-8 space-y-4 sm:space-y-0">
        <button
          className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'createtopic' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setActiveComponent('createtopic')}
        >
          Create Topic     
       </button>
        <button
          className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'Get All Topic' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setActiveComponent('Get All Topic')}
        >
          Get All Topic
        </button>
      </div>

      <div className="mt-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default CreateTopicPage;
