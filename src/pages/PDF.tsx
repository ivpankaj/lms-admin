import React, { useState, useRef, useEffect } from 'react';
import {  FaBook, FaTags, FaFileAlt, FaUpload, FaFilePdf } from 'react-icons/fa';

interface Course {
  name: string;
  id: number;
}
const apiUrl = import.meta.env.VITE_API_URL;

const PDF: React.FC = () => {
  const [PDFName, setPDFName] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<boolean>(false); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedTopic, setSelectedTopic] = useState<number | ''>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [PDFFile, setPDFFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/course/getall`, {
          method: 'GET',
        });
        const data = await response.json();
        setCourses(data.data.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedCourse) {
        try {
          const response = await fetch(`${apiUrl}/api/admin/topic/getall/${selectedCourse}`, {
            method: 'GET',
          });
          const data = await response.json();
          setTopics(data.data.data);
        } catch (error) {
          console.error('Failed to fetch topics:', error);
        }
      }
    };
    fetchTopics();
  }, [selectedCourse]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPDFName(file.name);
      setPDFFile(file);
    } else {
      setPDFName('');
      setPDFFile(null);
    }
  };

  const handleLocalUpload = async () => {
    if (!PDFFile) {
      alert('No PDF file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('courseId', String(selectedCourse));
    formData.append('topicId', String(selectedTopic));
    formData.append('title', title);
    formData.append('description', description);
    formData.append('pdfFile', PDFFile);
  
    try {
      const response = await fetch(`${apiUrl}api/upload/pdf`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json(); // Await the response.json() call
        console.log('response', data);
        setUploadStatus(true);
        alert('PDF uploaded locally');
      } else {
        const errorData = await response.json(); // Await the response.json() call
        alert(errorData.message || 'Failed to upload PDF locally');
      }
    } catch (error) {
      console.error('Error uploading PDF locally:', error);
      alert('An error occurred while uploading the PDF locally');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadStatus) {
      alert('Please upload the PDF locally before submitting');
      return;
    }

    const formData = new FormData();
    formData.append('courseId', String(selectedCourse));
    formData.append('topicId', String(selectedTopic));
    formData.append('title', title);
    formData.append('description', description);
    if (PDFFile) {
      formData.append('pdfFile', PDFFile);
    }

    try {
      const response = await fetch(`${apiUrl}/api/admin/uploadPDF`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Form submitted successfully');
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

  const handleCancel = () => {
    setPDFName('');
    setTitle('');
    setDescription('');
    setSelectedCourse('');
    setSelectedTopic('');
    setPDFFile(null);
    setUploadStatus(false); 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-3xl-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">PDF Information</h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="PDFName">
                      PDF Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FaFilePdf />
                      </span>
                      <input
                        className="w-full rounded-3xl border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="PDFName"
                        placeholder="PDF Name"
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
                              {course.name} (ID: {course.id})
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
                        topics.map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {topic.topic} (ID: {topic.id})
                          </option>
                        ))
                      ) : (
                        <option disabled>No topics available</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="PDFDescription">
                    Description
                  </label>
                  <textarea
                    id="PDFDescription"
                    className="w-full rounded-3xl border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    rows={4}
                    placeholder="Enter PDF description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-5.5">
                <input
  ref={fileInputRef}
  type="file"
  accept=".pdf"
  className="hidden"
  onChange={handleFileChange}
/>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-3xl bg-primary py-2.5 px-4 text-white transition hover:bg-opacity-90 dark:hover:bg-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaFileAlt /> Choose PDF
                  </button>
                  {PDFName && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Selected: {PDFName}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-3xl bg-primary py-2.5 px-4 text-white transition hover:bg-opacity-90 dark:hover:bg-primary"
                    onClick={handleLocalUpload}
                  >
                    <FaUpload /> Upload PDF
                  </button>

                  

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-3xl border border-stroke py-2.5 px-4 text-black transition hover:bg-gray-200 dark:text-white dark:hover:bg-darkgray"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDF;
