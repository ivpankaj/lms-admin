import React, { useState } from 'react';
import CreateMcqs from '../components/testPdf/UploadPdf';
import GetAllMcqs from '../components/testPdf/GetAllPdf';

const TestPdf: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>('UploadVideo');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'UploadVideo':
                return <CreateMcqs />;
            case 'GetAllVideos':
                return <GetAllMcqs />;
            default:
                return <CreateMcqs />;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">MCQs Management</h1>
            <div className="flex flex-wrap justify-center mb-8 space-y-4 sm:space-y-0">
                <button
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'UploadVideo' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => setActiveComponent('UploadVideo')}
                >
                    Create MCQs
                </button>
                <button
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'GetAllVideos' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => setActiveComponent('GetAllVideos')}
                >
                    Get All MCQs
                </button>
            </div>

            <div className="mt-4">
                {renderComponent()}
            </div>
        </div>
    );
};

export default TestPdf;