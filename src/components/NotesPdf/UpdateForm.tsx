import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { FaFileAlt, FaUpload } from 'react-icons/fa';
import { MdOutlineNoteAdd } from 'react-icons/md'; // Importing MdOutlineNoteAdd
import { FaBook, FaTags } from 'react-icons/fa'; // Importing FaBook and FaTags

interface UpdateFormProps {
    pdf: any;
    onClose: () => void;
    onUpdate: (updatedPdf: any) => void;
}

const api = import.meta.env.VITE_API_URL;

const UpdateForm: React.FC<UpdateFormProps> = ({ pdf, onClose, onUpdate }) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState(pdf.title || '');
    const [description, setDescription] = useState(pdf.description || '');
    const [selectedCourse, setSelectedCourse] = useState<number | ''>(pdf.courseId || '');
    const [selectedTopic, setSelectedTopic] = useState<number | ''>(pdf.topicId || '');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = Cookies.get('authToken');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`${api}/api/admin/course/${pdf.courseId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const data = await response.json();
                setSelectedCourse(data.course.name);
            } catch (error) {
                console.error('Failed to fetch course:', error);
            }
        };

        fetchCourse();
    }, [pdf.courseId, token]);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await fetch(`${api}/api/admin/topic/${pdf.topicId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const topics = result.data;

                if (topics.length > 0) {
                    const firstTopicId = topics[0].topic;
                    setSelectedTopic(firstTopicId);

                } else {
                    setSelectedTopic('');
                }
            } catch (error) {
                console.error('Failed to fetch topic:', error);
            }
        };

        fetchTopic();
    }, [pdf.topicId, token]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('courseId', pdf.courseId);
        formData.append('topicId', pdf.topicId);
        if (file) {
            formData.append('pdfFile', file);
        }

        try {
            const response = await fetch(`${api}/api/admin/upload/pdf`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update PDF');
            }

            const updatedPdf = await response.json();
            alert('PDF updated successfully');
            onUpdate(updatedPdf);
            onClose();
        } catch (error) {
            console.error('Error updating PDF:', error);
            alert('Failed to update PDF');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 mt-20 relative grid grid-cols-1 gap-4">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-lg text-gray-700 hover:text-gray-900"
                >
                    ✖
                </button>
                <div className="p-7">
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-2 flex flex-col gap-5.5 sm:flex-row">
                            <div className="w-full sm:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="NotesName">
                                    Notes Name
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4.5 top-4">
                                        <MdOutlineNoteAdd />
                                    </span>
                                    <input
                                        className="w-full rounded-lg border border-stroke bg-gray py-2 pl-11.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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
                                    <input
                                        id="CourseID"
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={selectedCourse}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white" htmlFor="TopicID">
                                Topic
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <FaTags />
                                </span>
                                <input
                                    id="TopicID"
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={selectedTopic}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white" htmlFor="Description">
                                Description
                            </label>
                            <div className="relative">
                                <span className="absolute left-4.5 top-4">
                                    <FaFileAlt />
                                </span>
                                <textarea
                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    id="Description"
                                    rows={4}
                                    placeholder="Write your description here"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div id="FileUpload" className="relative mb-4 block w-full cursor-pointer appearance-none rounded-3xl border border-dashed border-primary bg-gray dark:bg-meta-4 sm:py-4">
                            <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0 outline-none"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center justify-center">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                    <FaUpload className="text-primary" />
                                </span>
                                <p>
                                    <span className="text-primary">Click to upload</span> or drag and drop
                                </p>
                                {file && (
                                    <p className="text-center text-sm text-primary">
                                        {file.name}
                                    </p>
                                )}
                                <p className="text-center text-sm">
                                    PDF up to 5MB
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4.5">
                            <button
                                type="submit"
                                className="inline-flex h-12 w-28 items-center justify-center rounded bg-primary text-center text-sm font-medium text-white shadow-md transition duration-200 hover:bg-hover"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateForm;