import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getApiUrl } from '../../env';

// API setup
const apiUrl = getApiUrl();
const token = Cookies.get('authToken') || '';

axios.defaults.headers.common['Authorization'] = token;

// Define your interfaces
interface Notification {
  id: string;
  message: string;
  batchId: string;
}

interface Batch {
  _id: string;
  id: string;
  batchName: string;
}

// API functions
const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${apiUrl}/api/admin/notifications/all`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Could not fetch notifications');
  }
};

const updateNotification = async (id: string, message: string, batchId: string): Promise<void> => {
  try {
    await axios.put(`${apiUrl}/api/admin/notifications/${id}`, {
      message,
      batchId
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    throw new Error('Could not update notification');
  }
};

const deleteNotification = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${apiUrl}/api/admin/notifications/${id}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw new Error('Could not delete notification');
  }
};

const fetchBatches = async (): Promise<Batch[]> => {
  try {
    const response = await axios.get(`${apiUrl}/api/admin/batch/getAll`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
    throw new Error('Could not fetch batches');
  }
};

// NotificationList Component
const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await fetchNotifications();
        setNotifications(notificationsData);
        const batchesData = await fetchBatches();
        setBatches(batchesData);
      } catch (error) {
        console.error(error);
      }
    };

    loadNotifications();
  }, []);

  const handleUpdateNotification = async () => {
    if (editingNotification) {
      try {
        await updateNotification(editingNotification.id, editingNotification.message, editingNotification.batchId);
        setEditingNotification(null);
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingNotification) {
      setEditingNotification({
        ...editingNotification,
        [e.target.name]: e.target.value
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Manage Notifications</h2>
      {notifications.map(notification => (
        <div key={notification.id} className="mb-4 p-4 border border-gray-300 rounded-lg">
          {editingNotification?.id === notification.id ? (
            <div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                name="message"
                value={editingNotification.message}
                onChange={handleEditChange}
              />
              <select
                className="block w-full p-2 border border-gray-300 rounded-lg"
                name="batchId"
                value={editingNotification.batchId}
                onChange={handleEditChange}
              >
                <option value="">Select Batch</option>
                {batches.map(batch => (
                  <option 
                    key={batch._id} 
                    value={batch.id}
                  >
                    {batch.batchName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleUpdateNotification}
                className="bg-green-500 text-white p-2 rounded-lg mt-2 hover:bg-green-600"
              >
                Update
              </button>
              <button
                onClick={() => setEditingNotification(null)}
                className="bg-gray-500 text-white p-2 rounded-lg mt-2 ml-2 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p><strong>Message:</strong> {notification.message}</p>
              <p><strong>Batch ID:</strong> {notification.batchId}</p>
              <button
                onClick={() => setEditingNotification(notification)}
                className="bg-yellow-500 text-white p-2 rounded-lg mt-2 hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteNotification(notification.id)}
                className="bg-red-500 text-white p-2 rounded-lg mt-2 ml-2 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
