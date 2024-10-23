import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Make sure you have this package installed for cookie handling
import { getApiUrl } from '../../env';

const CounsellorForm = () => {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState('');

  const token = Cookies.get('authToken');
  const url = getApiUrl();

  const handleSubmit = async (event : any) => {
    event.preventDefault();
    
    // Basic validation to ensure all fields are filled
    if (!fullName || !contactNumber || !email || !address) {
      setErrorMessage('All fields are required.');
      return;
    }

    setSuccessMessage(''); // Clear previous messages
    setErrorMessage('');
    setLoader(true); // Show loader

    try {
      const response = await fetch(`${url}/api/admin/counsellor/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({
          fullName,
          contactNumber,
          email,
          address,
          password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || 'Failed to register counsellor.');
        setLoader(false); // Hide loader
        return;
      }
      
      const result = await response.json();
      setSuccessMessage(result.message);
      setPassword(result.password); // Save password from response
      console.log('Success:', result);
      
      // Optionally, clear the form fields
      setFullName('');
      setContactNumber('');
      setEmail('');
      setAddress('');

    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoader(false); // Hide loader
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 self-center">
        <div className="flex flex-col gap-9">
          <div className="rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white self-center">
                Counsellor Registration Form
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Full Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Contact Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your contact number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>


                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    password <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your contact number"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-3xl border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-3xl bg-blue-700 py-3 text-white font-medium transition hover:bg-blue-800 focus:outline-none"
                >
                  {loader ? (
                    <span className="animate-spin">Loading...</span> // Simple spinner
                  ) : (
                    'Submit'
                  )}
                </button>

                {/* Display success or error messages */}
                {successMessage && (
                  <div className="mt-4 text-green-500 dark:text-green-300">
                    {successMessage}
                    {password && (
                      <div className="mt-2 text-black dark:text-white">
                        <strong>Password:</strong> {password}
                      </div>
                    )}
                  </div>
                )}
                {errorMessage && (
                  <div className="mt-4 text-red-500 dark:text-red-300">
                    {errorMessage}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CounsellorForm;
