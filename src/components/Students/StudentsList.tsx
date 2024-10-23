import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CommonPopup from '../../components/CommonPopup';
import { getApiUrl } from '../../env';
import useConfirmationDialog from '../ConfirmBox/useConfirmationDialouge';


interface Student {
  id: number;
  contactNumber: string;
  studentId: string;
  order_id: string;
  studentName: string;
  isPaymentDone: string;
  wallet: number;
  order_amount: number;
  userName: string;
  name: string;
  emailAddress: string;
  courseName: string;
  strongPassword: string | null;
  referbyId: string | null;
  status: boolean;
  studentProfile: string | null;
  batchNames: string | null;
}

const StudentsList = () => {


  const[openDilog,setOpenDilog] = useState(false);

  const { openDialog, Dialog } = useConfirmationDialog();

  const handleDelete = (id : any) => {
    setOpenDilog(true);
    openDialog('Are you sure you want to delete this item?', () => {
      handleDeleteClick(id);
    });
  };


  const apiUrl = getApiUrl();
  const token = Cookies.get('authToken');

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [orderAmount, setOrderAmount] = useState<number | ''>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleShowPopup = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/student/getAll`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        console.log(data.message)
      }
      const data = await response.json();
      setStudents(data.data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(student.studentName);
    setEmail(student.emailAddress);
    setContactNumber(student.contactNumber);
    setOrderId(student.order_id);
    setOrderAmount(student.order_amount);
    setIsEditing(true);
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedStudent) {
      try {
        const response = await fetch(`${apiUrl}/api/admin/student/update/${selectedStudent.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: studentName,
            emailAddress: email,
            contactNumber: contactNumber,
            order_id: orderId,
            order_amount: orderAmount,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          handleShowPopup();
          fetchStudents();
          setIsEditing(false);
          setSelectedStudent(null);
        } else {
          const data = await response.json();
          setMessage(data.message);
          handleShowPopup();
        }
      } catch (error) {
        console.error('Failed to update student:', error);
      }
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/student/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
        },
      });
      if (response.ok) {
        setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
        setMessage('Student deleted successfully');
        handleShowPopup();
      } else {
        const data = await response.json();
        setMessage(data.message);
        handleShowPopup();
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token]);

  return (
    <>
      {/* <Breadcrumb pageName="Student List" /> */}

      {!isEditing && <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Students List
              </h3>
            </div>
            <div className="p-6.5">
              {students.length > 0 ? (
                students.map((student) => (
                  <div key={student.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold">{student.studentName}</h4>
                    <p>Email: {student.emailAddress}</p>
                    <p>Phone: {student.contactNumber}</p>
                    <p>Order ID: {student.order_id}</p>
                    <p>Order Amount: {student.order_amount}</p>
                    <p>Course: {student.courseName}</p>
                    <p>BatchName: {student.batchNames}</p>
                    <div className="mt-2 flex gap-4">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No students available</p>
              )}
            </div>
          </div>
        </div>
      </div>}

      {isEditing && (
        <div className=" inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">

          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <p
              onClick={() => setIsEditing(false)}
              className=" top-4  text-xl font-bold cursor-pointer justify-self-end"
            >
              X
            </p>
            <h3 className="text-lg font-semibold">Update Student Details</h3>
            <form onSubmit={handleUpdateSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-black dark:text-white">Student Name</label>
                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black dark:text-white">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black dark:text-white">Phone Number</label>
                <input
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  type="tel"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black dark:text-white">Order ID</label>
                <input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black dark:text-white">Order Amount</label>
                <input
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  type="number"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mt-2 w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <CommonPopup
        isVisible={isPopupVisible}
        message={message}
        onClose={handleClosePopup}
      />

      {
        openDilog&&<Dialog/>
      }
    </>
  );
};

export default StudentsList;
