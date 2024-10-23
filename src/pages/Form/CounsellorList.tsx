import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getApiUrl } from '../../env';
import useConfirmationDialog from '../../components/ConfirmBox/useConfirmationDialouge';

// Define TypeScript interfaces
interface Counselor {
  id: number;
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
}

const CounselorList: React.FC = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const token = Cookies.get('authToken');
  const url = getApiUrl();

  // Fetch counselors
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await fetch(`${url}/api/admin/counsellors/getall`, {
          headers: {
            'Authorization': `${token}`
          }
        });
        if (!response.ok) {
          const error = await response.json();
          alert(error.message);
          throw new Error('Failed to fetch counselors');
        }
        const result = await response.json();
        console.log('Result counselors:', result.counsellors);
        setCounselors(result.counsellors);
      } catch (error) {
        console.error('Error fetching counselors:', error);
        setErrorMessage('Failed to fetch counselors');
      }
    };

    fetchCounselors();
  }, [url, token]);

  // Handle update
  const handleUpdate = async () => {
    if (!selectedCounselor) return;

    try {
      const response = await fetch(`${url}/api/admin/counsellor/update/${selectedCounselor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(selectedCounselor),
      });

      if (!response.ok) {
        throw new Error('Failed to update counselor');
      }

      const result = await response.json();
      setSuccessMessage(`Counselor updated successfully. Password: ${result.password}`);
      setEditMode(false);
      setCounselors(prev =>
        prev.map(c => (c.id === selectedCounselor.id ? selectedCounselor : c))
      );
    } catch (error) {
      console.error('Error updating counselor:', error);
      setErrorMessage('Failed to update counselor');
    }
  };

  // Handle delete
  const { openDialog, Dialog } = useConfirmationDialog();
  const[showDeleteDialog,setShowDeleteDialog] = useState(false);
  
  const handleDelete = (id: any) => {
    setShowDeleteDialog(true);
    openDialog('Are you sure you want to delete this item?', () => {
      // Perform the delete action here
      handleDeleteConfirmation(id)
    });
  };

  const handleDeleteConfirmation = async (id: number) => {
    try {
      const response = await fetch(`${url}/api/admin/counsellor/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete counselor');
      }

      setCounselors(prev => prev.filter(c => c.id !== id));
      setSuccessMessage('Counselor deleted successfully');
    } catch (error) {
      console.error('Error deleting counselor:', error);
      setErrorMessage('Failed to delete counselor');
    }
  };

  return (
    <div>
      <h3 className="font-medium text-black dark:text-white">Counselor List</h3>

      {
  showDeleteDialog && <Dialog />
}
      {errorMessage && (
        <div className="mt-4 text-red-500 dark:text-red-300">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 text-green-500 dark:text-green-300">
          {successMessage}
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Contact Number</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {counselors.length > 0 && counselors.map((counselor) => (
            <tr key={counselor.id}>
              <td className="py-2 px-4 border-b">
                {editMode && selectedCounselor?.id === counselor.id ? (
                  <input
                    type="text"
                        className='border-b'
                    value={selectedCounselor.fullName}
                    onChange={(e) => setSelectedCounselor({ ...selectedCounselor, fullName: e.target.value })}
                  />
                ) : (
                  counselor.fullName
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editMode && selectedCounselor?.id === counselor.id ? (
                  <input
                    type="text"
                        className='border-b'
                    value={selectedCounselor.contactNumber}
                    onChange={(e) => setSelectedCounselor({ ...selectedCounselor, contactNumber: e.target.value })}
                  />
                ) : (
                  counselor.contactNumber
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editMode && selectedCounselor?.id === counselor.id ? (
                  <input
                    type="email"
                        className='border-b'
                    value={selectedCounselor.email}
                    onChange={(e) => setSelectedCounselor({ ...selectedCounselor, email: e.target.value })}
                  />
                ) : (
                  counselor.email
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editMode && selectedCounselor?.id === counselor.id ? (
                  <input
                    className='border-b'
                    type="text"
                    value={selectedCounselor.address}
                    onChange={(e) => setSelectedCounselor({ ...selectedCounselor, address: e.target.value })}
                  />
                ) : (
                  counselor.address
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editMode && selectedCounselor?.id === counselor.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 text-white py-1 px-3 rounded"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-gray-500 text-white py-1 px-3 rounded ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setSelectedCounselor(counselor);
                      }}
                      className="bg-yellow-500 text-white py-1 px-3 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(counselor.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CounselorList;
