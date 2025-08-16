import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Points to Django
  timeout: 5000, // 5 second timeout
});

export const healthCheck = async () => {
  try {
    const response = await api.get('health/');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};