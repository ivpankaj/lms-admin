import React, { useState, useEffect } from 'react';
import { FaCamera, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import userSix from '../../images/user/user-06.png';
import { getApiUrl } from '../../env';

const AdminProfile = () => {
  const [profiData, setProfileData] = useState({})
  const apiUrl = getApiUrl();
  const token = Cookies.get("authToken")

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/get`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          console.log("Admin:", data)
          setProfileData(data.adminData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getAdmin()

  }, [])

  console.log("Profle data", profiData)

  const handleEmailClick = () => {
    window.location.href = 'mailto:imvpankaj@gmail.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+91 9911064724';
  };

  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-16 h-28 w-28 rounded-full bg-white/20 p-1 backdrop-blur sm:h-36 sm:w-36 sm:p-2 md:h-44 md:w-44 md:p-3 lg:h-52 lg:w-52 lg:p-4">
            <div className="relative drop-shadow-2">
              <img src={userSix} alt="profile" className="w-full h-full object-cover rounded-full" />
              {/* <label
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
              </label> */}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white sm:text-3xl lg:text-4xl">
              {profiData.name}
            </h3>
            <p className="font-medium text-lg sm:text-xl">Admin || SkillOnTime</p>
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <FaEnvelope size={18} />
                <span className="hidden sm:inline">{profiData.email}</span>
              </button>
              <button
                onClick={handlePhoneClick}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <FaPhone size={18} />
                <span className="hidden sm:inline">{profiData.mobile}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;