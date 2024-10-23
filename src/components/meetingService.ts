import axios from 'axios';
import { getApiUrl } from '../env';

const API_URL = getApiUrl();

export const getMeetings = async () => {
    const response = await axios.get(`${API_URL}/api/meeting/getall`);
    return response.data;
};

export const getMeetingById = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createMeeting = async (meetingData: { title: string; description: string; link: string; }) => {
    const response = await axios.post(`${API_URL}/api/meeting/create`, meetingData);
    return response.data;
};

export const updateMeeting = async (id: number, meetingData: { title: string; description: string; link: string; }) => {
    const response = await axios.put(`${API_URL}/api/meeting/update/${id}`, meetingData);
    return response.data;
};

export const deleteMeeting = async (id: number) => {
    const response = await axios.delete(`${API_URL}/api/meeting/delete/${id}`);
    return response.data;
};
