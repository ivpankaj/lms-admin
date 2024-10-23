import React from 'react';

interface CustomAlertProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg z-10">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
