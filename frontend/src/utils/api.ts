import axios from 'axios';
import { store } from '../store/store';
import { setCredentials, logout } from '../store/slices/authSlice';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state if token is invalid/expired
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (data: { email: string; password: string; full_name: string; confirmPassword?: string }) =>
  api.post('/auth/register', {
    email: data.email,
    password: data.password,
    full_name: data.full_name,
    confirm_password: data.confirmPassword
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const getCurrentUser = () => api.get('/auth/me');

export const initializeAuth = async () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (token && storedUser) {
    try {
      // First set the stored data to avoid flicker
      store.dispatch(setCredentials({
        user: JSON.parse(storedUser),
        token: token
      }));
      
      // Then validate with the server
      const response = await getCurrentUser();
      store.dispatch(setCredentials({
        user: response.data,
        token: token
      }));
    } catch (error) {
      // If there's an error (e.g., invalid/expired token), clear the auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      store.dispatch(logout());
    }
  }
};

// Events APIs
export const getEvents = (params?: { skip?: number; limit?: number; status?: string; category?: string }) =>
  api.get('/events', { params });

export const getEvent = (id: string) => api.get(`/events/${id}`);

export const createEvent = (data: any) => api.post('/events', data);

export const updateEvent = (id: string, data: any) => api.put(`/events/${id}`, data);

export const deleteEvent = (id: string) => api.delete(`/events/${id}`);

export const registerForEvent = (id: string) => api.post(`/events/${id}/register`);

// Articles APIs
export const getArticles = (params?: { skip?: number; limit?: number; tag?: string; status?: string }) =>
  api.get('/articles', { params });

export const getArticle = (id: string) => api.get(`/articles/${id}`);

export const createArticle = (data: any) => api.post('/articles', data);

export const updateArticle = (id: string, data: any) => api.put(`/articles/${id}`, data);

export const deleteArticle = (id: string) => api.delete(`/articles/${id}`);

export const likeArticle = (id: string) => api.post(`/articles/${id}/like`);

// Volunteers APIs
export const getOpportunities = (params?: { skip?: number; limit?: number; category?: string; status?: string }) =>
  api.get('/volunteers', { params });

export const getOpportunity = (id: string) => api.get(`/volunteers/${id}`);

export const createOpportunity = (data: any) => api.post('/volunteers', data);

export const updateOpportunity = (id: string, data: any) => api.put(`/volunteers/${id}`, data);

export const deleteOpportunity = (id: string) => api.delete(`/volunteers/${id}`);

export const applyForOpportunity = (id: string, data: any) => api.post(`/volunteers/${id}/apply`, data);

// Sponsors APIs
export const getSponsors = (params?: { skip?: number; limit?: number; tier?: string; status?: string }) =>
  api.get('/sponsors', { params });

export const getSponsor = (id: string) => api.get(`/sponsors/${id}`);

export const createSponsor = (data: any) => api.post('/sponsors', data);

export const updateSponsor = (id: string, data: any) => api.put(`/sponsors/${id}`, data);

export const deleteSponsor = (id: string) => api.delete(`/sponsors/${id}`);

export const submitSponsorshipInquiry = (data: any) => api.post('/sponsors/inquire', data);

// Users APIs
export const getUsers = (params?: { skip?: number; limit?: number; role?: string }) =>
  api.get('/users', { params });

export const getUser = (id: string) => api.get(`/users/${id}`);

export const updateUserProfile = (data: any) => api.put('/users/me', data);

export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);

export const deleteUser = (id: string) => api.delete(`/users/${id}`); 