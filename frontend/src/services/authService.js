import api from './api';

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data; // { user, accessToken, refreshToken }
}

export async function register({ fullName, email, password }) {
  const { data } = await api.post('/auth/register', { fullName, email, password });
  return data.data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function logout() {
  await api.post('/auth/logout');
}
