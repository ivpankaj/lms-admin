import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaExclamation } from "react-icons/fa";
import CustomAlert from '../videos/CustomAlertBox';
import UpdateForm from './UpdateForm';

const api = import.meta.env.VITE_API_URL;

const GetAllMcqs: React.FC = () => {
    const token = Cookies.get('authToken');
    const [mcq, setMcq] = useState<any[]>([]);
    const [selectedMcq, setSelectedMcq] = useState<any>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [mcqIdToDelete, setMcqIdToDelete] = useState<string | null>(null);

    const fetchMcq = async () => {
        if (!api) {
            console.error('API URL is not defined');
            return;
        }

        try {
            const response = await fetch(`${api}/api/admin/mcq/getAll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch MCQs');
            }

            const data = await response.json();
            setMcq(data);
        } catch (error) {
            console.error('Error fetching MCQs:', error);
        }
    };

    useEffect(() => {
        fetchMcq();
    }, [api, token]);

    const handleDelete = async (mcqId: string) => {
        setMcqIdToDelete(mcqId);
        setShowAlert(true);
    };

    const confirmDelete = async () => {
        if (mcqIdToDelete) {
            try {
                const response = await fetch(`${api}/api/admin/mcq/delete/${mcqIdToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete MCQ');
                }

                await fetchMcq();
            } catch (error) {
                console.error('Error deleting MCQ:', error);
            } finally {
                setShowAlert(false);
                setMcqIdToDelete(null);
            }
        }
    };

    const cancelDelete = () => {
        setShowAlert(false);
        setMcqIdToDelete(null);
    };

    const handleUpdate = () => {
        fetchMcq();
        setShowUpdateForm(false);
    };

    const openUpdateForm = (mcq: any) => {
        setSelectedMcq(mcq);
        setShowUpdateForm(true);
    };

    const closeUpdateForm = () => {
        setShowUpdateForm(false);
        setSelectedMcq(null);
    };

    return (
        <div className="flex flex-col w-full h-full p-4 overflow-y-auto bg-gray-50">
            {
                mcq.length === 0 &&
                <div className='flex items-center justify-center text-[10rem] w-full h-full opacity-20 my-20'><FaExclamation /></div>
            }
            <section className="mb-8">
                <div className="flex flex-wrap flex-col gap-6 w-full">
                    {mcq.map((item) => {
                        let parsedAnswerKey: string[] = [];
                        try {
                            // Attempt to parse the answer_key
                            if (typeof item.answer_key === 'string') {
                                parsedAnswerKey = JSON.parse(item.answer_key) as string[];
                                if (!Array.isArray(parsedAnswerKey)) {
                                    throw new Error('Answer key is not an array');
                                }
                            } else if (Array.isArray(item.answer_key)) {
                                // If it's already an array, use it directly
                                parsedAnswerKey = item.answer_key as string[];
                            } else {
                                throw new Error('Unexpected format for answer_key');
                            }
                        } catch (error) {
                            console.error('Invalid JSON format for answer_key:', item.answer_key, error);
                            parsedAnswerKey = [];
                        }

                        return (
                            <div key={item.id} className="flex flex-col w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                                <div className="p-4 w-full">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Name: {item.title}</h3>
                                    <hr />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Question: {item.question_text}</h3>
                                    <h3 className="text-lg font-semibold text-gray-800">Options -:</h3>
                                    <ul className="space-y-1">
                                        {parsedAnswerKey.length > 0 ? (
                                            parsedAnswerKey.map((option: string, idx: number) => (
                                                <li key={idx} className={idx === item.correct_option ? 'text-green-600 font-bold' : 'text-gray-700'}>
                                                    {`Option ${idx + 1}: ${option}`}
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-red-500">Invalid answer options</p>
                                        )}
                                        <p className='text-lg font-bold'>Correct Answer: <span className='text-lg font-bold text-green-600'>{parsedAnswerKey[item.correct_option]}</span></p>
                                    </ul>
                                    <div className="flex justify-between gap-2 mt-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openUpdateForm(item); }}
                                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {showUpdateForm && selectedMcq && (
                <UpdateForm
                    mcq={selectedMcq}
                    onClose={closeUpdateForm}
                    onUpdate={handleUpdate}
                />
            )}

            {showAlert && (
                <CustomAlert
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this MCQ?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default GetAllMcqs;


