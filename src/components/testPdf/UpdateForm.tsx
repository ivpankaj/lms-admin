// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { FaUpload } from 'react-icons/fa';

// interface UpdateFormProps {
//     mcq: any;
//     onClose: () => void;
//     onUpdate: (updatedMcq: any) => void;
// }

// const api = import.meta.env.VITE_API_URL;

// const UpdateForm: React.FC<UpdateFormProps> = ({ mcq, onClose, onUpdate }) => {
//     const [mcqTitle, setMcqTitle] = useState(mcq.title || '');
//     const [mcqQuestionText, setMcqQuestionText] = useState(mcq.question_text || '');
//     const [mcqAnswerKey, setMcqAnswerKey] = useState<string[]>(JSON.parse(mcq.answer_key) || ['', '', '', '']);
//     const [mcqCorrectOption, setMcqCorrectOption] = useState(mcq.correct_option || 0);
//     const [courseName, setCourseName] = useState(mcq.courseName || '');
//     const [topicName, setTopicName] = useState(mcq.topicName || '');

//     const token = Cookies.get('authToken');

//     useEffect(() => {
//         if (mcq.courseId) {
//             const fetchCourse = async () => {
//                 try {
//                     const response = await fetch(`${api}/api/admin/course/${mcq.courseId}`, {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `${token}`,
//                         },
//                     });
//                     const data = await response.json();
//                     setCourseName(data.course.name);
//                 } catch (error) {
//                     console.error('Failed to fetch course:', error);
//                 }
//             };
//             fetchCourse();
//         }
//     }, [mcq.courseId, token]);

//     useEffect(() => {
//         if (mcq.topicId) {
//             const fetchTopic = async () => {
//                 try {
//                     const response = await fetch(`${api}/api/admin/topic/${mcq.topicId}`, {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `${token}`,
//                         },
//                     });
//                     const result = await response.json();
//                     const topics = result.data;

//                     if (topics.length > 0) {
//                         const firstTopicId = topics[0].topic;
//                         setTopicName(firstTopicId);
//                     } else {
//                         setTopicName('');
//                     }
//                 } catch (error) {
//                     console.error('Failed to fetch topic:', error);
//                 }
//             };

//             fetchTopic();
//         }
//     }, [mcq.topicId, token]);

//     const handleAnswerChange = (index: number, value: string) => {
//         const newAnswers = [...mcqAnswerKey];
//         newAnswers[index] = value;
//         setMcqAnswerKey(newAnswers);
//     };

//     const handleFormSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const updatedMcq = {
//             title: mcqTitle,
//             question_text: mcqQuestionText,
//             answer_key: mcqAnswerKey,
//             correct_option: mcqCorrectOption,
//             courseId: mcq.courseId,
//             topicId: mcq.topicId
//         };

//         try {
//             const response = await fetch(`${api}/api/admin/mcq/update/${mcq.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(updatedMcq)
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update MCQ');
//             }

//             const updatedData = await response.json();
//             alert('MCQ updated successfully');
//             onUpdate(updatedData);
//             onClose();
//         } catch (error) {
//             console.error('Error updating MCQ:', error);
//             alert('Failed to update MCQ');
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 mt-20 relative grid grid-cols-1 gap-4">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-lg text-gray-700 hover:text-gray-900"
//                 >
//                     ✖
//                 </button>
//                 <h3 className="text-xl font-semibold col-span-full">Update MCQ Information</h3>
//                 <form onSubmit={handleFormSubmit}>
//                     <div className="grid grid-cols-2 gap-4 col-span-full">
//                         <div className="">
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="mcqTitle">
//                                 MCQ Title
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 type="text"
//                                 id="mcqTitle"
//                                 placeholder="Enter MCQ Title"
//                                 value={mcqTitle}
//                                 onChange={(e) => setMcqTitle(e.target.value)}
//                             />
//                         </div>
//                         <div className="">
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="courseName">
//                                 Course Name
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none"
//                                 type="text"
//                                 id="courseName"
//                                 value={courseName}
//                                 readOnly
//                             />
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 col-span-full">
//                         <div className="">
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="topicName">
//                                 Topic Name
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none"
//                                 type="text"
//                                 id="topicName"
//                                 value={topicName}
//                                 readOnly
//                             />
//                         </div>
//                         <div className="">
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="mcqQuestionText">
//                                 Question Text
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 type="text"
//                                 id="mcqQuestionText"
//                                 placeholder="Enter Question Text"
//                                 value={mcqQuestionText}
//                                 onChange={(e) => setMcqQuestionText(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     {mcqAnswerKey.map((answer, index) => (
//                         <div key={index} className="">
//                             <label className="block text-sm font-medium text-gray-700" htmlFor={`mcqAnswer${index}`}>
//                                 Answer Option {index + 1}
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 type="text"
//                                 id={`mcqAnswer${index}`}
//                                 placeholder={`Enter Answer Option ${index + 1}`}
//                                 value={answer}
//                                 onChange={(e) => handleAnswerChange(index, e.target.value)}
//                             />
//                         </div>
//                     ))}
//                     <div className="col-span-full">
//                         <label className="block text-sm font-medium text-gray-700" htmlFor="mcqCorrectOption">
//                             Correct Answer Option
//                         </label>
//                         <select
//                             id="mcqCorrectOption"
//                             value={mcqCorrectOption}
//                             onChange={(e) => setMcqCorrectOption(Number(e.target.value))}
//                             className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         >
//                             {mcqAnswerKey.map((_, index) => (
//                                 <option key={index} value={index}>
//                                     Option {index + 1}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <button
//                         type="submit"
//                         className="flex items-center mt-2 gap-2 rounded-lg bg-green-600 py-2 px-4 text-white transition hover:bg-green-700 col-span-full"
//                     >
//                         <FaUpload /> Update MCQ
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UpdateForm;




// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { FaUpload } from 'react-icons/fa';

// interface UpdateFormProps {
//     mcq: any;
//     onClose: () => void;
//     onUpdate: (updatedMcq: any) => void;
// }

// const api = import.meta.env.VITE_API_URL;

// const UpdateForm: React.FC<UpdateFormProps> = ({ mcq, onClose, onUpdate }) => {
//     const [mcqTitle, setMcqTitle] = useState(mcq.title || '');
//     const [mcqQuestionText, setMcqQuestionText] = useState(mcq.question_text || '');
//     const [mcqAnswerKey, setMcqAnswerKey] = useState<string[]>(JSON.parse(mcq.answer_key || '["", "", "", ""]'));
//     const [mcqCorrectOption, setMcqCorrectOption] = useState(mcq.correct_option || 0);
//     const [courseName, setCourseName] = useState(mcq.courseName || '');
//     const [topicName, setTopicName] = useState(mcq.topicName || '');
//     const token = Cookies.get('authToken');

//     useEffect(() => {
//         if (mcq.courseId) {
//             const fetchCourse = async () => {
//                 try {
//                     const response = await fetch(`${api}/api/admin/course/${mcq.courseId}`, {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                         },
//                     });
//                     if (!response.ok) {
//                         throw new Error('Failed to fetch course');
//                     }
//                     const data = await response.json();
//                     setCourseName(data.course.name);
//                 } catch (error) {
//                     console.error('Failed to fetch course:', error);
//                 }
//             };
//             fetchCourse();
//         }
//     }, [mcq.courseId, token]);

//     useEffect(() => {
//         if (mcq.topicId) {
//             const fetchTopic = async () => {
//                 try {
//                     const response = await fetch(`${api}/api/admin/topic/${mcq.topicId}`, {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                         },
//                     });
//                     if (!response.ok) {
//                         throw new Error('Failed to fetch topic');
//                     }
//                     const result = await response.json();
//                     const topics = result.data;

//                     if (topics.length > 0) {
//                         const firstTopicId = topics[0].topic;
//                         setTopicName(firstTopicId);
//                     } else {
//                         setTopicName('');
//                     }
//                 } catch (error) {
//                     console.error('Failed to fetch topic:', error);
//                 }
//             };

//             fetchTopic();
//         }
//     }, [mcq.topicId, token]);

//     const handleAnswerChange = (index: number, value: string) => {
//         const newAnswers = [...mcqAnswerKey];
//         newAnswers[index] = value;
//         setMcqAnswerKey(newAnswers);
//     };

//     const handleFormSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const updatedMcq = {
//             title: mcqTitle,
//             question_text: mcqQuestionText,
//             answer_key: JSON.stringify(mcqAnswerKey),
//             correct_option: mcqCorrectOption,
//             courseId: mcq.courseId,
//             topicId: mcq.topicId
//         };

//         try {
//             const response = await fetch(`${api}/api/admin/mcq/update/${mcq.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(updatedMcq)
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update MCQ');
//             }

//             const updatedData = await response.json();
//             alert('MCQ updated successfully');
//             onUpdate(updatedData);
//             onClose();
//         } catch (error) {
//             console.error('Error updating MCQ:', error);
//             alert('Failed to update MCQ');
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 mt-20 relative grid grid-cols-1 gap-4">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-lg text-gray-700 hover:text-gray-900"
//                 >
//                     ✖
//                 </button>
//                 <h3 className="text-xl font-semibold col-span-full">Update MCQ Information</h3>
//                 <form onSubmit={handleFormSubmit}>
//                     <div className="grid grid-cols-2 gap-4 col-span-full">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="mcqTitle">
//                                 MCQ Title
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 type="text"
//                                 id="mcqTitle"
//                                 placeholder="Enter MCQ Title"
//                                 value={mcqTitle}
//                                 onChange={(e) => setMcqTitle(e.target.value)}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="courseName">
//                                 Course Name
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none"
//                                 type="text"
//                                 id="courseName"
//                                 value={courseName}
//                                 readOnly
//                             />
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 col-span-full">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="topicName">
//                                 Topic Name
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none"
//                                 type="text"
//                                 id="topicName"
//                                 value={topicName}
//                                 readOnly
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700" htmlFor="mcqQuestionText">
//                                 Question Text
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 type="text"
//                                 id="mcqQuestionText"
//                                 placeholder="Enter Question Text"
//                                 value={mcqQuestionText}
//                                 onChange={(e) => setMcqQuestionText(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     {mcqAnswerKey.map((answer, index) => (
//                         <div key={index}>
//                             <label className="block text-sm font-medium text-gray-700" htmlFor={`mcqAnswer${index}`}>
//                                 Answer Option {index + 1}
//                             </label>
//                             <input
//                                 className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 type="text"
//                                 id={`mcqAnswer${index}`}
//                                 placeholder={`Enter Answer Option ${index + 1}`}
//                                 value={answer}
//                                 onChange={(e) => handleAnswerChange(index, e.target.value)}
//                             />
//                         </div>
//                     ))}
//                     <div className="col-span-full">
//                         <label className="block text-sm font-medium text-gray-700" htmlFor="mcqCorrectOption">
//                             Correct Answer Option
//                         </label>
//                         <select
//                             id="mcqCorrectOption"
//                             value={mcqCorrectOption}
//                             onChange={(e) => setMcqCorrectOption(Number(e.target.value))}
//                             className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         >
//                             {mcqAnswerKey.map((_, index) => (
//                                 <option key={index} value={index}>
//                                     Option {index + 1}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <button
//                         type="submit"
//                         className="flex items-center mt-2 gap-2 rounded-lg bg-green-600 py-2 px-4 text-white transition hover:bg-green-700 col-span-full"
//                     >
//                         <FaUpload /> Update MCQ
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UpdateForm;




import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaUpload } from 'react-icons/fa';

interface UpdateFormProps {
    mcq: any;
    onClose: () => void;
    onUpdate: (updatedMcq: any) => void;
}

const api = import.meta.env.VITE_API_URL;

const UpdateForm: React.FC<UpdateFormProps> = ({ mcq, onClose, onUpdate }) => {

    console.log('mcq')

    const [mcqTitle, setMcqTitle] = useState(mcq.title || '');
    const [mcqQuestionText, setMcqQuestionText] = useState(mcq.question_text || '');
    const [mcqAnswerKey, setMcqAnswerKey] = useState<string[]>(JSON.parse(mcq.answer_key) || ['', '', '', '']);
    const [mcqCorrectOption, setMcqCorrectOption] = useState(mcq.correct_option || 0);
    const [courseName, setCourseName] = useState(mcq.courseName || '');
    const [topicName, setTopicName] = useState(mcq.topicName || '');

    const token = Cookies.get('authToken');

    useEffect(() => {
        if (mcq.courseId) {
            const fetchCourse = async () => {
                try {
                    const response = await fetch(`${api}/api/admin/course/${mcq.courseId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${token}`,
                        },
                    });
                    if(!response.ok){
                      console.error('not vlaid json');
                        alert('we')
                    }
                    const data = await response.json();
                    setCourseName(data.course.name);
                } catch (error) {
                    console.error('Failed to fetch course:', error);
                }
            };
            fetchCourse();
        }
    }, [mcq.courseId, token]);

    useEffect(() => {
        if (mcq.topicId) {
            const fetchTopic = async () => {
                try {
                    const response = await fetch(`${api}/api/admin/topic/${mcq.topicId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `${token}`,
                        },
                    });
                    const result = await response.json();
                    const topics = result.data;

                    if (topics.length > 0) {
                        const firstTopicId = topics[0].topic;
                        setTopicName(firstTopicId);
                    } else {
                        setTopicName('');
                    }
                } catch (error) {
                    console.error('Failed to fetch topic:', error);
                }
            };

            fetchTopic();
        }
    }, [mcq.topicId, token]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...mcqAnswerKey];
        newAnswers[index] = value;
        setMcqAnswerKey(newAnswers);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedMcq = {
            title: mcqTitle,
            question_text: mcqQuestionText,
            answer_key: mcqAnswerKey,
            correct_option: mcqCorrectOption,
            courseId: mcq.courseId,
            topicId: mcq.topicId
        };

        try {
            const response = await fetch(`${api}/api/admin/mcq/update/${mcq.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedMcq)
            });

            if (!response.ok) {
                throw new Error('Failed to update MCQ');
            }

            const updatedData = await response.json();
            alert('MCQ updated successfully');
            onUpdate(updatedData);
            onClose();
        } catch (error) {
            console.error('Error updating MCQ:', error);
            alert('Failed to update MCQ');
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
                <h3 className="text-xl font-semibold col-span-full">Update MCQ Information</h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-2 gap-4 col-span-full">
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="mcqTitle">
                                MCQ Title
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="text"
                                id="mcqTitle"
                                placeholder="Enter MCQ Title"
                                value={mcqTitle}
                                onChange={(e) => setMcqTitle(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="courseName">
                                Course Name
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none"
                                type="text"
                                id="courseName"
                                value={courseName}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 col-span-full">
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="topicName">
                                Topic Name
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none"
                                type="text"
                                id="topicName"
                                value={topicName}
                                readOnly
                            />
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="mcqQuestionText">
                                Question Text
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="text"
                                id="mcqQuestionText"
                                placeholder="Enter Question Text"
                                value={mcqQuestionText}
                                onChange={(e) => setMcqQuestionText(e.target.value)}
                            />
                        </div>
                    </div>
                    {mcqAnswerKey.map((answer, index) => (
                        <div key={index} className="">
                            <label className="block text-sm font-medium text-gray-700" htmlFor={`mcqAnswer${index}`}>
                                Answer Option {index + 1}
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="text"
                                id={`mcqAnswer${index}`}
                                placeholder={`Enter Answer Option ${index + 1}`}
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="mcqCorrectOption">
                            Correct Answer Option
                        </label>
                        <select
                            id="mcqCorrectOption"
                            value={mcqCorrectOption}
                            onChange={(e) => setMcqCorrectOption(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {mcqAnswerKey.map((_, index) => (
                                <option key={index} value={index}>
                                    Option {index + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center mt-2 gap-2 rounded-lg bg-green-600 py-2 px-4 text-white transition hover:bg-green-700 col-span-full"
                    >
                        <FaUpload /> Update MCQ
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateForm;