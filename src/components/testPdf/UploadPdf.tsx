
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import SuccessPopup from '../SuccessPopup';
import { getApiUrl } from '../../env';

interface Question {
    title: string;
    question_text: string;
    answer_key: string[];
    correct_option: number;
    courseId: number | null;
    topicId: number | null;
}

const CreateMcqs: React.FC = () => {
    // const apiUrl = import.meta.env.VITE_API_URL;

    const apiUrl = getApiUrl();

    const token = Cookies.get('authToken');

    const [title, setTitle] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [answerKey, setAnswerKey] = useState<string[]>(['', '', '', '']);
    const [correctOption, setCorrectOption] = useState<number>(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [topics, setTopics] = useState<any[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const [errors, setErrors] = useState({
        title: false,
        questionText: false,
        answerKey: false,
        correctOption: false,
        selectedCourse: false,
        selectedTopic: false,
    });

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
    }, [apiUrl, token]);

    useEffect(() => {
        const fetchTopics = async () => {
            if (selectedCourse) {
                try {
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
    }, [selectedCourse, apiUrl, token]);

    const validateFields = () => {
        const newErrors = {
            title: !title,
            questionText: !questionText,
            answerKey: answerKey.some(option => option === ''),
            correctOption: correctOption < 0 || correctOption >= answerKey.length,
            selectedCourse: selectedCourse === null,
            selectedTopic: selectedTopic === null,
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some(error => error);
    };

    const handleAddQuestion = () => {
        if (!validateFields()) return;

        const newQuestion: Question = {
            title,
            courseId: selectedCourse,
            topicId: selectedTopic,
            question_text: questionText,
            answer_key: answerKey,
            correct_option: correctOption,
        };

        if (editingIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = newQuestion;
            setQuestions(updatedQuestions);
            setEditingIndex(null);
        } else {
            setQuestions([...questions, newQuestion]);
        }

        setTitle('');
        setQuestionText('');
        setAnswerKey(['', '', '', '']);
        setCorrectOption(0);
    };

    const handleEditQuestion = (index: number) => {
        const questionToEdit = questions[index];
        setTitle(questionToEdit.title);
        setQuestionText(questionToEdit.question_text);
        setAnswerKey(questionToEdit.answer_key);
        setCorrectOption(questionToEdit.correct_option);
        setEditingIndex(index);
    };

    const handleSubmit = () => {
        if (selectedCourse && selectedTopic && questions.length > 0) {
            const payload = questions.map(question => ({
                ...question,
                courseId: selectedCourse,
                topicId: selectedTopic,
            }));

            fetch(`${apiUrl}/api/admin/mcq/allCreate`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Questions submitted successfully:', data);
                    setShowPopup(true);
                    setQuestions([]);
                })
                .catch(error => {
                    console.error('Failed to submit questions:', error);
                });
        }
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <div className="mb-6">
                <label className={`block text-lg font-medium mb-2 ${errors.selectedCourse ? 'text-red-600' : 'text-gray-700'}`}>
                    Select Course <span className="text-red-600">*</span>:
                </label>
                <select
                    className={`block w-full p-2 border ${errors.selectedCourse ? 'border-red-600' : 'border-gray-300'} rounded-lg`}
                    value={selectedCourse ?? ''}
                    onChange={e => setSelectedCourse(Number(e.target.value))}
                >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
                {errors.selectedCourse && <p className="text-red-600 mt-2">Please select a course.</p>}
            </div>

            <div className="mb-6">
                <label className={`block text-lg font-medium mb-2 ${errors.selectedTopic ? 'text-red-600' : 'text-gray-700'}`}>
                    Select Topic <span className="text-red-600">*</span>:
                </label>
                <select
                    className={`block w-full p-2 border ${errors.selectedTopic ? 'border-red-600' : 'border-gray-300'} rounded-lg`}
                    value={selectedTopic ?? ''}
                    onChange={e => setSelectedTopic(Number(e.target.value))}
                    disabled={!selectedCourse}
                >
                    <option value="">Select a topic</option>
                    {topics.map(topic => (
                        <option key={topic.id} value={topic.id}>
                            {topic.topic}
                        </option>
                    ))}
                </select>
                {errors.selectedTopic && <p className="text-red-600 mt-2">Please select a topic.</p>}
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Title"
                    className={`block w-full p-2 border ${errors.title ? 'border-red-600' : 'border-gray-300'} rounded-lg mb-4`}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                {errors.title && <p className="text-red-600 mt-2">Title is required.</p>}
                <textarea
                    placeholder="Question Text"
                    className={`block w-full p-2 border ${errors.questionText ? 'border-red-600' : 'border-gray-300'} rounded-lg mb-4`}
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    required
                ></textarea>
                {errors.questionText && <p className="text-red-600 mt-2">Question text is required.</p>}
                <div className="space-y-2">
                    {answerKey.map((option, index) => (
                        <div key={index}>
                            <input
                                required
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                className={`block w-full p-2 border ${errors.answerKey ? 'border-red-600' : 'border-gray-300'} rounded-lg`}
                                value={option}
                                onChange={e => {
                                    const newAnswerKey = [...answerKey];
                                    newAnswerKey[index] = e.target.value;
                                    setAnswerKey(newAnswerKey);
                                }}
                            />
                        </div>
                    ))}
                </div>
                {errors.answerKey && <p className="text-red-600 mt-2">All options are required.</p>}
                <div className="mt-4">
                    <label className={`block text-lg font-medium mb-2 ${errors.correctOption ? 'text-red-600' : 'text-gray-700'}`}>
                        Correct Option <span className="text-red-600">*</span>:
                    </label>
                    <select
                        required
                        className={`block w-full p-2 border ${errors.correctOption ? 'border-red-600' : 'border-gray-300'} rounded-lg`}
                        value={correctOption}
                        onChange={e => setCorrectOption(Number(e.target.value))}
                    >
                        {answerKey.map((_, index) => (
                            <option key={index} value={index}>
                                Option {index + 1}
                            </option>
                        ))}
                    </select>
                    {errors.correctOption && <p className="text-red-600 mt-2">Please select the correct option.</p>}
                </div>
                <button
                    onClick={handleAddQuestion}
                    className="block w-full bg-blue-500 text-white p-2 rounded-lg mt-6"
                >
                    {editingIndex !== null ? 'Update Question' : 'Add Question'}
                </button>
            </div>

            <div className="space-y-4">
                {questions.map((question, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
                            <p className="text-gray-700 mb-2">{question.question_text}</p>
                            <ol className="list-decimal list-inside text-gray-700 mb-2">
                                {question.answer_key.map((option, idx) => (
                                    <li key={idx}>{option}</li>
                                ))}
                            </ol>
                            <p className="font-bold text-green-600">Correct Option: Option {question.correct_option + 1}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEditQuestion(index)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                className="block w-full bg-green-500 text-white p-2 rounded-lg mt-6"
            >
                Submit Questions
            </button>

            {showPopup && (
                <SuccessPopup
                    title="Success"
                    message="Questions have been submitted successfully!"
                    onConfirm={handlePopupClose}
                />
            )}
        </div>
    );
};

export default CreateMcqs;
