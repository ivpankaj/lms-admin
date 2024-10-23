import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getApiUrl } from '../../env';


interface Batch {
  _id: string;
   id: string;
  batchName: string;
}

const NotificationSender: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState<'all' | 'batch' | 'students'>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');

  const apiUrl = getApiUrl();
  const token = Cookies.get('authToken') || '';

  useEffect(() => {

    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/batch/getAll`, {
          headers: { 'Authorization': `${token}` }
        });
        setBatches(response?.data?.data);
      } catch (error) {
        console.error('Failed to fetch batches', error);
      }
    };

    fetchBatches();
  }, [apiUrl, token]);

  const handleSendNotification = async () => {
    try {
     
      await axios.post(`${apiUrl}/api/admin/notification/create`, {
        message,
        batchId : notificationType === 'batch' ? selectedBatchId : '' 
      }, {
        headers: { 'Authorization': `${token}` }
      });

      setSuccessMessage('Notification sent successfully');
      setMessage('');
      setSelectedBatch('');
      setSelectedStudents([]);
      setNotificationType('all');
    } catch (error) {
      setErrorMessage('Failed to send notification');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Send Notification</h1>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />

      <div className="mb-4">
        <label className="block mb-2">
          <input
            type="radio"
            checked={notificationType === 'all'}
            onChange={() => setNotificationType('all')}
            className="mr-2"
          />
          Send to All Students
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            checked={notificationType === 'batch'}
            onChange={() => setNotificationType('batch')}
            className="mr-2"
          />
          Send to Batch
        </label>
        {notificationType === 'batch' && (
          <select
            className="block w-full p-2 border border-gray-300 rounded-lg"
            onChange={(e) => {
              setSelectedBatch(e.target.value);
              console.log('selected bathc',e.target.value)
              const selectedId = e.target.value;
              const selectedName = e.target.options[e.target.selectedIndex].text;
              
              setSelectedBatchId(selectedId);
              console.log('Selected Batch ID:', selectedId);
              console.log('Selected Batch Name:', selectedName);
            }}

            value={selectedBatch}
          >
            <option value="">Select Batch</option>
            {batches.map(batch => (
              <option 
              key={batch._id} value={batch?.id}
              >{batch?.batchName}</option>
            ))}
          </select>
        )}
      
      </div>

      <button
        onClick={handleSendNotification}
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      >
        Send Notification
      </button>

      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
    </div>
  );
};

export default NotificationSender;





