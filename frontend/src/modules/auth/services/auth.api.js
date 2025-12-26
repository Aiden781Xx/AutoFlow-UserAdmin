import api from '../../../config/api';

export const registerUser = (data) =>
  api.post('/auth/register', data);

export const loginUser = (data) =>
  api.post('/auth/login', data);

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  api.post('/auth/reset-password', { token, password });

export const googleLogin = (idToken) =>
  api.post('/auth/google', { idToken });

export const refreshAccessToken = (refreshToken) =>
  api.post('/auth/refresh-token', { refreshToken });

export const logoutUser = (refreshToken) =>
  api.post('/auth/logout', { refreshToken });

export const getCurrentUser = () =>
  api.get('/user/me');
