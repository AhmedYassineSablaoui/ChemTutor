import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Points to Django
  timeout: 60000, // 60 second timeout (increased from 40)
  headers: { "Content-Type": "application/json" },

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

// Balance reaction
export const balanceReaction = async (input) => {
  const res = await api.post("reactions/balance/", { input });
  return res.data;
};

// Ask question
export const askQuestion = async (question, category) => {
  try {
    const response = await api.post('qa/', { question, category });
    return response.data;
  } catch (error) {
    console.error('QA request failed:', error);
    throw error;
  }
};