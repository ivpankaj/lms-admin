import React, { useEffect } from 'react';

interface CustomAlertProps {
    title: string;
    message: string;
    onConfirm: () => void;
}

const SuccessPopup: React.FC<CustomAlertProps> = ({ title, message, onConfirm }) => {
    useEffect(() => {
        document.body.classList.add('blur-background');

        return () => {
            document.body.classList.remove('blur-background');
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p className="mb-4">{message}</p>
                <button
                    onClick={onConfirm}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default SuccessPopup;
