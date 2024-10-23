import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getApiUrl } from '../env';
import useConfirmationDialog from '../components/ConfirmBox/useConfirmationDialouge';

interface Batch {
  id: number;
  courseName : string;
  courseId: number;
  totalStudent: number;
  remainingStudent: number;
  batchName: string;
  RegistrationStartDate: string;
}

const ManageBatches: React.FC = () => {
    
//   const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = getApiUrl();

  const token = Cookies.get('authToken');

  const [batches, setBatches] = useState<Batch[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingBatchId, setEditingBatchId] = useState<number | null>(null);
  const [updatedBatch, setUpdatedBatch] = useState<Batch | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/batch/getAll`, {
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Ensure data.data is an array
          if (Array.isArray(data.data)) {
            setBatches(data.data);
          } else {
            setErrorMessage('Unexpected data format');
          }
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch batches');
        }
      } catch (error) {
        setErrorMessage('An error occurred');
      }
    };

    fetchBatches();
  }, [apiUrl, token]);


  const { openDialog, Dialog } = useConfirmationDialog();
  
  const[showDeleteDialog,setShowDeleteDialog] = useState(false);

  const handleDelete = (id:any) => {
    setShowDeleteDialog(true);
    openDialog('Are you sure you want to delete this item?', () => {
      // Perform the delete action here
      ConfirmDelete(id);
    });
  };

  const ConfirmDelete = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/batch/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('Batch deleted successfully.');
        setBatches(batches.filter(batch => batch.id !== id));
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to delete batch');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatchId(batch.id);
    setUpdatedBatch(batch);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedBatch) {
      const { name, value } = e.target;
      setUpdatedBatch({
        ...updatedBatch,
        [name]: value,
      });
    }
  };

  const handleUpdate = async () => {
    if (updatedBatch) {
      try {
        const response = await fetch(`${apiUrl}/api/admin/batch/update/${updatedBatch.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBatch),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage('Batch updated successfully.');
          setBatches(batches.map(batch => (batch.id === updatedBatch.id ? updatedBatch : batch)));
          setEditingBatchId(null);
          setUpdatedBatch(null);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to update batch');
        }
      } catch (error) {
        setErrorMessage('An error occurred');
      }
    }
  };



  const formatDate = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    return date.toISOString().split('T')[0];
  };
  
 

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
    <h1 className="text-2xl font-semibold mb-6">Manage Batches</h1>

    {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
    {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

    {showDeleteDialog && <Dialog />}

    <div className="overflow-x-auto">
      <div className="bg-gray-100 rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 bg-gray-200 border-b border-gray-300 text-xs sm:text-sm font-medium text-gray-700">
         
          <div className="text-center">Course Name</div>
          <div className="text-center">Total Students</div>
          <div className="text-center">Remaining Students</div>
          <div className="text-center">Batch Name</div>
          <div className="text-center">Start Date</div>
          <div className="text-center">Actions</div>
        </div>

        {batches.map((batch) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center border-b border-gray-300 p-4 text-xs sm:text-sm"
            key={batch.id}
          >
            {editingBatchId === batch.id ? (
              <>
              <input
                  type="number"
                  name="totalStudent"
                  value={updatedBatch?.courseName || ''}
                  // onChange={handleChange}
                  className="w-full text-center text-black dark:text-white p-1 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="totalStudent"
                  value={updatedBatch?.totalStudent || ''}
                  onChange={handleChange}
                  className="w-full text-center text-black dark:text-white p-1 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  name="remainingStudent"
                  value={updatedBatch?.remainingStudent || ''}
                  onChange={handleChange}
                  className="w-full text-center text-black dark:text-white p-1 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="batchName"
                  value={updatedBatch?.batchName || ''}
                  onChange={handleChange}
                  className="w-full text-center text-black dark:text-white p-1 border border-gray-300 rounded"
                />
                <input
                  type="date"
                  name="RegistrationStartDate"
                  value={updatedBatch?.RegistrationStartDate || ''}
                  onChange={handleChange}
                  className="w-full text-center text-black dark:text-white p-1 border border-gray-300 rounded"
                />
                <div className="flex items-center justify-between sm:justify-center space-x-2 mt-2 col-span-6">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => setEditingBatchId(null)}
                    className="bg-gray-500 text-black px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                
                <p className="text-center">{batch.courseName}</p>
                <p className="text-center">{batch.totalStudent}</p>
                <p className="text-center">{batch.remainingStudent}</p>
                <p className="text-center">{batch.batchName}</p>
                <p className="text-center">{formatDate(batch.RegistrationStartDate)}</p>
                <div className="sm:justify-self-end justify-between sm:justify-center space-x-2 mt-2 col-span-6">
                  <button
                    onClick={() => handleEdit(batch)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(batch.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default ManageBatches;
