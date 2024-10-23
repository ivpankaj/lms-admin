import React, { useState } from 'react';
import UploadPdf from '../components/NotesPdf/UploadPdf';
import GetAllPdf from '../components/NotesPdf/GetAllPdf';

const NotesPdf: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>('UploadVideo');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'UploadVideo':
                return <UploadPdf />;
            case 'GetAllVideos':
                return <GetAllPdf />;
            default:
                return <UploadPdf />;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">PDF Management</h1>
            <div className="flex flex-wrap justify-center mb-8 space-y-4 sm:space-y-0">
                <button
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'UploadVideo' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => setActiveComponent('UploadVideo')}
                >
                    Upload PDF
                </button>
                <button
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md mr-2 ${activeComponent === 'GetAllVideos' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => setActiveComponent('GetAllVideos')}
                >
                    Get All PDF
                </button>
            </div>

            <div className="mt-4">
                {renderComponent()}
            </div>
        </div>
    );
};

export default NotesPdf;
