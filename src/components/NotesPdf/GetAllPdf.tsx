import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaExclamation } from "react-icons/fa";
import CustomAlert from '../videos/CustomAlertBox';
import UpdateForm from './UpdateForm';

const api = import.meta.env.VITE_API_URL;

const GetAllPdf: React.FC = () => {
    const token = Cookies.get('authToken');
    const [pdf, setPdf] = useState<any[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<any>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [pdfIdToDelete, setPdfIdToDelete] = useState<string | null>(null);

    const fetchPdf = async () => {
        if (!api) {
            console.error('API URL is not defined');
            return;
        }

        try {
            const response = await fetch(`${api}/api/admin/pdf/getAll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch PDFs');
            }

            const data = await response.json();
            const filteredData = data.filter((pdf: any) => !pdf.isDeleted);
            setPdf(filteredData);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
        }
    };

    useEffect(() => {
        fetchPdf();
    }, [api, token]);

    const handleDelete = async (pdfId: string) => {
        setPdfIdToDelete(pdfId);
        setShowAlert(true);
    };

    const confirmDelete = async () => {
        if (pdfIdToDelete) {
            console.log("PDFid:", pdfIdToDelete);

            try {
                const response = await fetch(`${api}/api/admin/notes/delete/${pdfIdToDelete}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete PDF');
                }

                await fetchPdf();
            } catch (error) {
                console.error('Error deleting PDF:', error);
            } finally {
                setShowAlert(false);
                setPdfIdToDelete(null);
            }
        }
    };

    const cancelDelete = () => {
        setShowAlert(false);
        setPdfIdToDelete(null);
    };

    const handleUpdate = () => {
        fetchPdf();
        setShowUpdateForm(false);
    };

    const openUpdateForm = (pdf: any) => {
        setSelectedPdf(pdf);
        setShowUpdateForm(true);
    };

    const closeUpdateForm = () => {
        setShowUpdateForm(false);
        setSelectedPdf(null);
    };

    const openPdf = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="flex flex-col w-full h-full p-4 overflow-y-auto">
            {
                pdf.length === 0 &&
                <div className='flex items-center justify-center text-[10rem] w-full h-full opacity-20 my-20'><FaExclamation /></div>
            }
            <section className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pdf.map((item) => {
                        let url = `${api}${item.filePath}`
                        console.log("PDF URL:", `${api}${item.filePath}`)
                        return (
                            <div
                                key={item.id}
                                onClick={() => openPdf(`${api}/${item.filePath}`)}
                                className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                            >
                                <div className="p-4">
                                    <div className="relative mb-4 flex items-center justify-center">
                                        <iframe
                                            src={url}
                                            className='w-full h-48 object-cover myVideo custom-video opacity-50'
                                            title={item.title}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                                    <div className="flex justify-between gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openUpdateForm(item);
                                            }}
                                            className='px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200'
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.id);
                                            }}
                                            className='px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200'
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

            {showUpdateForm && selectedPdf && (
                <UpdateForm
                    pdf={selectedPdf}
                    onClose={closeUpdateForm}
                    onUpdate={handleUpdate}
                />
            )}

            {showAlert && (
                <CustomAlert
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this PDF?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default GetAllPdf;
