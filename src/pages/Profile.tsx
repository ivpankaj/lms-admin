// import userSix from '../images/user/user-06.png';
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
// import { FaCamera, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa';
// import { getApiUrl } from '../env';

// const Profile: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [student, setStudent] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const apiUrl = getApiUrl();
//   const token = Cookies.get('authToken');

//   useEffect(() => {
//     const fetchStudent = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/api/admin/student/${id}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           setError(errorData.message || 'Failed to fetch student details');
//           throw new Error(errorData.message);
//         }

//         const data = await response.json();
//         console.log("Student Data:", data)
//         setStudent(data.data);
//       } catch (error: any) {
//         setError(error.message);
//         console.error('Failed to fetch student:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudent();
//   }, [apiUrl, id, token]);

//   const handleEmailClick = () => {
//     window.location.href = `mailto:${student?.emailAddress}`;
//   };

//   const handlePhoneClick = () => {
//     window.location.href = `tel:+${student?.contactNumber}`;
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <>
//       <Breadcrumb pageName="Profile" />

//       <div className="rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//         <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
//           <div className="relative z-30 mx-auto -mt-16 h-28 w-28 rounded-full bg-white/20 p-1 backdrop-blur sm:h-36 sm:w-36 sm:p-2 md:h-44 md:w-44 md:p-3 lg:h-52 lg:w-52 lg:p-4">
//             {student.studentProfile ? <div className="relative drop-shadow-2">
//               <img
//                 src={`${apiUrl}${student?.studentProfile}`}
//                 alt="profile"
//                 className="w-full h-full object-cover rounded-full"
//               />
//               <label
//                 htmlFor="profile"
//                 className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:h-10 sm:w-10 sm:bottom-2 sm:right-2 md:h-12 md:w-12 md:bottom-3 md:right-3 lg:h-14 lg:w-14 lg:bottom-4 lg:right-4"
//               >
//                 <FaCamera size={16} />
//                 <input
//                   type="file"
//                   name="profile"
//                   id="profile"
//                   className="sr-only"
//                 />
//               </label>
//             </div>
//               : <div className="relative drop-shadow-2">
//                 <img src={userSix} alt="profile" className="w-full h-full object-cover rounded-full" />
//                 <label
//                   htmlFor="profile"
//                   className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:h-10 sm:w-10 sm:bottom-2 sm:right-2 md:h-12 md:w-12 md:bottom-3 md:right-3 lg:h-14 lg:w-14 lg:bottom-4 lg:right-4"
//                 >
//                   <FaCamera size={16} />
//                   <input
//                     type="image"
//                     name="profile"
//                     id="profile"
//                     className="sr-only"
//                   />
//                 </label>
//               </div>
//             }
//           </div>
//           <div className="mt-4">
//             <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white sm:text-3xl lg:text-4xl">
//               {student?.name}
//             </h3>
//             <p className="font-medium text-lg sm:text-xl">{student?.studentName}</p>
//             <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
//               <button
//                 onClick={handleEmailClick}
//                 className="flex items-center gap-2 text-primary hover:underline"
//               >
//                 <FaEnvelope size={18} />
//                 <span className="hidden sm:inline">{student?.emailAddress}</span>
//               </button>
//               <button
//                 onClick={handlePhoneClick}
//                 className="flex items-center gap-2 text-primary hover:underline"
//               >
//                 <FaPhone size={18} />
//                 <span className="hidden sm:inline">+{student?.contactNumber}</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 px-4 sm:px-6 lg:px-8">
//           <h4 className="text-lg font-semibold text-black dark:text-white sm:text-xl lg:text-2xl">Student Details</h4>
//           <table className="w-full mt-4 border-collapse bg-white dark:bg-boxdark">
//             <thead>
//               <tr className="border-b border-stroke dark:border-strokedark">
//                 <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Field</th>
//                 <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b border-stroke dark:border-strokedark">
//                 <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Address</td>
//                 <td className="p-3 text-sm text-gray-800 dark:text-gray-100 flex items-center">
//                   <FaMapMarkerAlt className="mr-2" /> {student?.address}
//                 </td>
//               </tr>
//               <tr className="border-b border-stroke dark:border-strokedark">
//                 <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Course</td>
//                 <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.courseName}</td>
//               </tr>
//               <tr className="border-b border-stroke dark:border-strokedark">
//                 <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Enrollment Date</td>
//                 <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.createdAt.slice(0, 10)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;







import userSix from '../images/user/user-06.png';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getApiUrl } from '../env';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const apiUrl = getApiUrl();
  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/student/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch student details');
          throw new Error(errorData.message);
        }

        const data = await response.json();
        setStudent(data.data);
      } catch (error: any) {
        setError(error.message);
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [apiUrl, id, token]);

  const handleEmailClick = () => {
    if (student?.emailAddress) {
      window.location.href = `mailto:${student.emailAddress}`;
    }
  };

  const handlePhoneClick = () => {
    if (student?.contactNumber) {
      window.location.href = `tel:+${student.contactNumber}`;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-16 h-28 w-28 rounded-full bg-white/20 p-1 backdrop-blur sm:h-36 sm:w-36 sm:p-2 md:h-44 md:w-44 md:p-3 lg:h-52 lg:w-52 lg:p-4">
            {student?.studentProfile ? (
              <div className="relative drop-shadow-2">
                <img
                  src={`${apiUrl}${student.studentProfile}`}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:h-10 sm:w-10 sm:bottom-2 sm:right-2 md:h-12 md:w-12 md:bottom-3 md:right-3 lg:h-14 lg:w-14 lg:bottom-4 lg:right-4"
                >
                  <FaCamera size={16} />
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="sr-only"
                  />
                </label>
              </div>
            ) : (
              <div className="relative drop-shadow-2">
                <img
                  src={userSix}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:h-10 sm:w-10 sm:bottom-2 sm:right-2 md:h-12 md:w-12 md:bottom-3 md:right-3 lg:h-14 lg:w-14 lg:bottom-4 lg:right-4"
                > */}
                  {/* <FaCamera size={16} /> */}
                  {/* <input
                    type="image"
                    name="profile"
                    id="profile"
                    className="sr-only"
                  /> */}
                {/* </label> */}
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white sm:text-3xl lg:text-4xl">
              {student?.name}
            </h3>
            <p className="font-medium text-lg sm:text-xl">{student?.studentName}</p>
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <FaEnvelope size={18} />
                <span className="hidden sm:inline">{student?.emailAddress}</span>
              </button>
              <button
                onClick={handlePhoneClick}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <FaPhone size={18} />
                <span className="hidden sm:inline">+{student?.contactNumber}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 sm:px-6 lg:px-8">
          <h4 className="text-lg font-semibold text-black dark:text-white sm:text-xl lg:text-2xl">Student Details</h4>
          <table className="w-full mt-4 border-collapse bg-white dark:bg-boxdark">
            <thead>
              <tr className="border-b border-stroke dark:border-strokedark">
                <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Field</th>
                <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Details</th>
              </tr>
            </thead>
            <tbody>
            <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Name</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.name}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Email</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.emailAddress}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Contact</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.contactNumber}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">User Name</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.userName}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Course</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.courseName}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Order ID</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.order_id}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Enrollment Date</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{new Date(student?.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Order Amount</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.order_amount}</td>
              </tr>
              <tr className="border-b border-stroke dark:border-strokedark">
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">Payment Status</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-100">{student?.isPaymentDone === '1' ? 'Paid' : 'Unpaid'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Profile;
