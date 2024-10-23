import React, { FC } from 'react';

interface PopupProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const CommonErrorPopUp: FC<PopupProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark blur effect */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-sm z-50">
        <h2 className="text-xl font-semibold mb-4 text-center">Error</h2>
        <p className="mb-4 text-center">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block mx-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CommonErrorPopUp;
