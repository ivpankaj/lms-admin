import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CommonPopup from '../../components/CommonPopup';
import { getApiUrl } from '../../env';

interface Course {
  name: string;
  id: number;
}

// const apiUrl = import.meta.env.VITE_API_URL;

const CreateStudents = () => {

    const apiUrl = getApiUrl();

  const [courses, setCourses] = useState<Course[]>([]);
  const [studentName, setStudentName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [orderAmount, setOrderAmount] = useState<number | ''>('');
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [adminToken, setAdminToken] = useState<string | undefined>('')
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [message, setmessage] = useState('');

  const handleShowPopup = () => {
    setPopupVisible(true);

  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const token = Cookies.get('authToken');
    setAdminToken(token)
  }, [adminToken])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/course/getall`, {
          method: 'GET',
          headers: {
            'Authorization': `${adminToken}`,
          },
        });
        const data = await response.json();
        console.log("Course DAta:", data);

        console.log("Course Data:", data.data.data)
        setCourses(data.data.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [adminToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrderAmount(value === '' ? '' : Number(value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/api/admin/student/create`, {
        method: 'POST',
        headers: {
          'Authorization': `${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'courseIds': selectedCourse,
          'name': studentName,
          'emailAddress': email,
          'contactNumber': contactNumber,
          'order_id': orderId,
          'order_amount': orderAmount
        })
      });

      if (response.ok) {
        const data = await response.json()
        console.log("User Data:", data);
        setmessage(data.message)
        handleShowPopup();
        setStudentName('')
        setEmail('')
        setContactNumber('')
        setOrderId('')
        setOrderAmount('')
        setSelectedCourse('')
      } else {
        // Handle error
        const data = await response.json()
        console.log("User error:", data);
        setmessage(data.message)
        handleShowPopup();
      }
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Student Enrollment" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Enrollment Form 
              </h3> 
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Student Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      onChange={(e) => setStudentName(e.target.value)}
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    onChange={(e) => setContactNumber(e.target.value)}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="relative z-20 bg-transparent dark:bg-form-input rounded-3xl">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Course <span className="text-meta-1">*</span>
                  </label>
                  <select name="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    className={`relative z-20 w-full appearance-none rounded-3xl border border-stroke bg-transparent py-3 px-5 mb-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white'
                      }`}>
                    <option value="" selected disabled className="text-body dark:text-bodydark">Select course</option>
                    {courses.length > 0 ? (
                      courses.map((course) => {

                        return (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        )
                      })
                    ) : (
                      <option disabled>No courses available</option>
                    )}
                  </select>
                  <span className="absolute top-1/2 right-4 z-30">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Order ID <span className="text-meta-1">*</span>
                    </label>
                    <input
                      onChange={(e) => setOrderId(e.target.value)}
                      value={orderId}
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Order Amount <span className="text-meta-1">*</span>
                    </label>
                    <input
                      onChange={handleInputChange}
                      value={orderAmount}
                      type="number"
                      placeholder="Enter your name"
                      className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <button type='submit' className="mt-4 w-full rounded-3xl bg-blue-700 py-3 text-white font-medium transition hover:bg-blue-800 focus:outline-none">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <CommonPopup
        isVisible={isPopupVisible}
        message={message}
        onClose={handleClosePopup}
      />
    </>
  );
};

export default CreateStudents;

