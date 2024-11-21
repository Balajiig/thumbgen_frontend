// frontend/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';


export const getChatResponse = async (message) => {
  const response = await axios.post(`${API_BASE_URL}/chat`, { message });
  return response.data;
};

export const generateThumbnail = async (video_url) => {
  const response = await axios.post(`${API_BASE_URL}/generate_thumbnail`, { video_url });
  return response.data;
};
