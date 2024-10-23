import React, { useState, useEffect } from 'react';
import { FaVideo, FaBook, FaTags, FaFileAlt, FaUpload } from 'react-icons/fa';
import Cookies from 'js-cookie';

const api = import.meta.env.VITE_API_URL;

interface UpdateFormProps {
    video: any;
    onClose: () => void;
    onUpdate: (updatedVideo: any) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ video, onClose, onUpdate }) => {
    const [videoName, setVideoName] = useState(video.title || '');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [description, setDescription] = useState(video.description || '');
    const [file, setFile] = useState<File | null>(null);

    const token = Cookies.get('authToken');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`${api}/api/admin/course/${video.courseId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const data = await response.json();
                setSelectedCourse(data.course.name);
                console.log("Course Data:", data);
            } catch (error) {
                console.error('Failed to fetch course:', error);
            }
        };

        fetchCourse();
    }, [video.courseId, token]);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await fetch(`${api}/api/admin/topic/${video.topicId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                console.log("Result:", result)
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
    }, [video.topicId, token]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', videoName);
        formData.append('courseId', video.courseId);
        formData.append('topicId', video.topicId);
        formData.append('description', description);
        if (file) {
            formData.append('videoFile', file);
        }

        try {
            const response = await fetch(`${api}/api/admin/video/${video.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update video');
            }

            const updatedVideo = await response.json(); // Assuming the updated video data is returned

            alert('Video updated successfully');
            onUpdate(updatedVideo);  // Pass the updated video back to the parent
            onClose();
        } catch (error) {
            console.error('Error updating video:', error);
            alert('Failed to update video');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-lg text-gray-700 hover:text-gray-900"
                >
                    ✖
                </button>
                <h3 className="text-xl font-semibold mb-4">Video Information</h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="VideoName">
                                Video Name
                            </label>
                            <div className="relative mt-1">
                                <FaVideo className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    type="text"
                                    id="VideoName"
                                    placeholder="Video Name"
                                    value={videoName}
                                    onChange={(e) => setVideoName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="CourseID">
                                Course
                            </label>
                            <div className="relative mt-1">
                                <FaBook className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    id="CourseID"
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={selectedCourse}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="TopicID">
                            Topic
                        </label>
                        <div className="relative mt-1">
                            <FaTags className="absolute left-3 top-3 text-gray-500" />
                            <input
                                id="TopicID"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={selectedTopic}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="VideoDescription">
                            Description
                        </label>
                        <textarea
                            id="VideoDescription"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={4}
                            placeholder="Enter video description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 py-2 px-4 text-white transition hover:bg-indigo-700"
                            onClick={() => document.querySelector('input[type="file"]')?.click()}
                        >
                            <FaFileAlt /> Choose Video
                        </button>
                        <p className="mt-2 text-sm text-gray-600">Selected: {file ? file.name : 'None'}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 py-2 px-4 text-white transition hover:bg-indigo-700"
                        >
                            <FaUpload /> Update Video
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 py-2 px-4 text-gray-700 transition hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateForm;
