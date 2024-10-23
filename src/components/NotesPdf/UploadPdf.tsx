import React, { useState, useRef, useEffect } from 'react';
import { FaBook, FaTags, FaFileAlt, FaUpload } from 'react-icons/fa';
import { MdOutlineNoteAdd } from 'react-icons/md';
import Cookies from 'js-cookie';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import SuccessPopup from '../SuccessPopup';

const apiUrl = import.meta.env.VITE_API_URL;

interface Course {
  name: string;
  id: number;
}

const NotesUploadPdf = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedTopic, setSelectedTopic] = useState<number | ''>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAlert, setShowAlert] = useState(false);

  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/course/getall`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
          },
        });
        const data = await response.json();
        setCourses(data.data.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [token]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedCourse) {
        try {
          console.log('Selected Course ID:', selectedCourse);
          const response = await fetch(`${apiUrl}/api/admin/topic/${selectedCourse}`, {
            method: 'GET',
            headers: {
              'Authorization': `${token}`,
            },
          });
          const data = await response.json();
          setTopics(data.data);
        } catch (error) {
          console.error('Failed to fetch topics:', error);
        }
      }
    };
    fetchTopics();
  }, [selectedCourse, token]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    } else {
      setPdfFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      console.log('No PDF file selected')
      return;
    }

    const formData = new FormData();
    formData.append('courseId', String(selectedCourse));
    formData.append('topicId', String(selectedTopic));
    formData.append('title', title);
    formData.append('description', description);
    formData.append('pdfFile', pdfFile);

    console.log("API URL:", `${apiUrl}/api/admin/upload/pdf`);

    try {
      const response = await fetch(`${apiUrl}/api/admin/upload/pdf`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (response.ok) {
        setUploadStatus(true);
        setTitle('');
        setDescription('');
        setSelectedCourse('');
        setSelectedTopic('');
        setPdfFile(null);
        setShowAlert(true)
        handleCancel();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleCancel = () => {
    setTitle('');
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Upload Notes" />
        <div className="grid grid-cols-1 gap-8">
          <div className="col-span-1">
            <div className="rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Upload Notes</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="NotesName"
                      >
                        Notes Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <MdOutlineNoteAdd />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          id="NotesName"
                          placeholder="Notes Name"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="CourseID">
                        Course
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <FaBook />
                        </span>
                        <select
                          id="CourseID"
                          className="w-full rounded-3xl border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(Number(e.target.value))}
                        >
                          <option value="">Select a course</option>
                          {courses.length > 0 ? (
                            courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No courses available</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="TopicID">
                      Topic
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FaTags />
                      </span>
                      <select
                        id="TopicID"
                        className="w-full rounded-3xl border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(Number(e.target.value))}
                      >
                        <option value="">Select a topic</option>
                        {topics.length > 0 ? (
                          topics.map((topic: any) => (
                            <option key={topic.id} value={topic.id}>
                              {topic.topic}
                            </option>
                          ))
                        ) : (
                          <option disabled>No topics available</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Description"
                    >
                      Description
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FaFileAlt />
                      </span>
                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        id="Description"
                        rows={6}
                        placeholder="Write your description here"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div id="FileUpload" className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-3xl border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                    <input
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <FaUpload className="text-primary" />
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or drag and drop
                      </p>
                      {pdfFile && (
                        <p className="mt-1.5 max-w-152 text-center text-sm text-primary">
                          {pdfFile.name}
                        </p>
                      )}
                      <p className="mt-1.5 max-w-152 text-center text-sm">
                        PDF up to 5MB
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded-3xl border border-stroke bg-white py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded-3xl border border-primary bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {showAlert && (
          <SuccessPopup
            title="Success"
            message="Notes successfully created!"
            onConfirm={() => {
              handleSubmit(new Event('submit') as unknown as React.FormEvent);
              handleCloseAlert();
            }}
          />
        )}
      </div>
    </>
  );
};

export default NotesUploadPdf;