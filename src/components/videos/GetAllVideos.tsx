import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaExclamation } from "react-icons/fa";
import UpdateForm from '../UpdateForm';
import CustomAlert from './CustomAlertBox';

const api = import.meta.env.VITE_API_URL;

const GetAllVideos: React.FC = () => {
    const token = Cookies.get('authToken');
    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [videoIdToDelete, setVideoIdToDelete] = useState<string | null>(null);

    const fetchVideos = async () => {
        if (!api) {
            console.error('API URL is not defined');
            return;
        }

        try {
            const response = await fetch(`${api}/api/admin/video`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();
            setVideos(data.data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [api, token]);

    const handleDelete = async (videoId: string) => {
        setVideoIdToDelete(videoId);
        setShowAlert(true);
    };

    const confirmDelete = async () => {
        if (videoIdToDelete) {
            try {
                const response = await fetch(`${api}/api/admin/video/${videoIdToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete video');
                }

                await fetchVideos();
            } catch (error) {
                console.error('Error deleting video:', error);
            } finally {
                setShowAlert(false);
                setVideoIdToDelete(null);
            }
        }
    };

    const cancelDelete = () => {
        setShowAlert(false);
        setVideoIdToDelete(null);
    };

    const handleUpdate = (updatedVideo?: any) => {
        fetchVideos();
        setShowUpdateForm(false);
    };

    const openUpdateForm = (video: any) => {
        setSelectedVideo(video);
        setShowUpdateForm(true);
    };

    const closeUpdateForm = () => {
        setShowUpdateForm(false);
        setSelectedVideo(null);
    };

    return (
        <div className="flex flex-col w-full h-full p-4 overflow-y-auto">
            {
                videos.length === 0 &&
                <div className='flex items-center justify-center text-[10rem] w-full h-full opacity-20 my-20'><FaExclamation /></div>
            }
            <section className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((item) => {
                        const url = `${api}${item.filePath}`;
                        return (
                            <div key={item.id} className="cursor-pointer">
                                <div className="relative">
                                    <video
                                        controls
                                        controlsList="nodownload"
                                        src={url}
                                        className='w-full h-48 object-cover myVideo custom-video'
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className='bg-white p-4 rounded-b-lg'>
                                    <h3 className="text-center font-bold">{item.title}</h3>
                                    <div className='flex justify-between items-center mt-2'>
                                        <button onClick={() => openUpdateForm(item)} className='w-full sm:w-auto px-4 py-2 rounded-lg shadow-md bg-blue-500 text-white' >
                                            Update Video
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className='w-full sm:w-auto px-4 py-2 rounded-lg shadow-md bg-red-500 text-white' >
                                            Delete Video
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {showUpdateForm && selectedVideo && (
                <UpdateForm
                    video={selectedVideo}
                    onClose={closeUpdateForm}
                    onUpdate={(updatedVideo) => handleUpdate(updatedVideo)}
                />
            )}

            {showAlert && (
                <CustomAlert
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this video?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default GetAllVideos;