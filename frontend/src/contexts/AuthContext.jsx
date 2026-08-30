import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = 'eklavya_access_token';
const REFRESH_TOKEN_KEY = 'eklavya_refresh_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | authenticated | unauthenticated | error
  const [error, setError] = useState(null);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setStatus('unauthenticated');
      return;
    }
    setStatus('loading');
    try {
      const currentUser = await authService.fetchCurrentUser();
      setUser(currentUser);
      setStatus('authenticated');
    } catch (err) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (credentials) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await authService.login(credentials);
      localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      setUser(result.user);
      setStatus('authenticated');
      return result.user;
    } catch (err) {
      setError(err.message);
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setStatus('loading');
    setError(null);
    try {
      const result = await authService.register(payload);
      localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      setUser(result.user);
      setStatus('authenticated');
      return result.user;
    } catch (err) {
      setError(err.message);
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors on logout - clear local session regardless
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({ user, status, error, login, register, logout, isAuthenticated: status === 'authenticated' }),
    [user, status, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
