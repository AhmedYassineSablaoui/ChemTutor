import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Points to Django
  timeout: 60000, // 60 second timeout (increased from 40)
  headers: { "Content-Type": "application/json" },

});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
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

// Auth APIs
export const registerUser = async (username, password, email) => {
  const res = await api.post('auth/register/', { username, password, email });
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await api.post('auth/login/', { username, password });
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post('auth/logout/');
  return res.data;
};

export const fetchMe = async () => {
  const res = await api.get('auth/me/');
  return res.data;
};

export const saveAuth = (token, user) => {
  localStorage.setItem('auth_token', token);
  if (user) localStorage.setItem('auth_user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

export default api;