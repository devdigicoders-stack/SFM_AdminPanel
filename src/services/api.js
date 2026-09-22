import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Auto-attach JWT token from localStorage to all outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sfm_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for auth expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear and prompt login
      localStorage.removeItem('sfm_jwt_token');
      localStorage.removeItem('sfm_admin_token');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAPI = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const getProfileAPI = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};

export const updateProfileAPI = async (profileData) => {
  const res = await api.put('/auth/profile', profileData);
  return res.data;
};

export const changePasswordAPI = async (oldPassword, newPassword) => {
  const res = await api.put('/auth/password', { oldPassword, newPassword });
  return res.data;
};

// Enquiries APIs
export const getEnquiriesAPI = async () => {
  const res = await api.get('/enquiries');
  return res.data;
};

export const updateEnquiryStatusAPI = async (id, status) => {
  const res = await api.put(`/enquiries/${id}/status`, { status });
  return res.data;
};

export const deleteEnquiryAPI = async (id) => {
  const res = await api.delete(`/enquiries/${id}`);
  return res.data;
};

// Blogs APIs
export const getAdminBlogsAPI = async () => {
  const res = await api.get('/blogs');
  return res.data;
};

export const createBlogAPI = async (blogData) => {
  const res = await api.post('/blogs', blogData);
  return res.data;
};

export const updateBlogAPI = async (id, blogData) => {
  const res = await api.put(`/blogs/${id}`, blogData);
  return res.data;
};

export const deleteBlogAPI = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};

// Categories APIs
export const getCategoriesAPI = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const createCategoryAPI = async (catData) => {
  const res = await api.post('/categories', catData);
  return res.data;
};

export const deleteCategoryAPI = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// Banners APIs
export const getBannersAPI = async () => {
  const res = await api.get('/banners');
  return res.data;
};

export const createBannerAPI = async (banData) => {
  const res = await api.post('/banners', banData);
  return res.data;
};

export const updateBannerAPI = async (id, banData) => {
  const res = await api.put(`/banners/${id}`, banData);
  return res.data;
};

export const deleteBannerAPI = async (id) => {
  const res = await api.delete(`/banners/${id}`);
  return res.data;
};

// Homepage & Settings APIs
export const getHomepageSettingsAPI = async () => {
  const res = await api.get('/settings/homepage');
  return res.data;
};

export const updateHomepageSettingsAPI = async (data) => {
  const res = await api.put('/settings/homepage', data);
  return res.data;
};

export const getSocialsAPI = async () => {
  const res = await api.get('/settings/socials');
  return res.data;
};

export const updateSocialsAPI = async (data) => {
  const res = await api.put('/settings/socials', data);
  return res.data;
};

export default api;
