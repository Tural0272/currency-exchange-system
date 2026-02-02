import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, setUnauthorizedHandler, createApiClient } from '../utils/api';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState([]);

  const clearAuthState = useCallback(() => {
    setToken(null);
    setUser(null);
    setBalances([]);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearAuthState);
  }, [clearAuthState]);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const refreshBalances = useCallback(async () => {
    if (!token) return;
    const api = createApiClient(token);
    const response = await api.get('/wallet/balances');
    setBalances(response.data.balances || []);
  }, [token]);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      const api = createApiClient(storedToken);
      const response = await api.get('/wallet/balances');

      if (response.status === 200) {
        setBalances(response.data.balances || []);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setBalances([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const baseUrl = await getApiBaseUrl();
      const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem('authToken', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      const api = createApiClient(newToken);
      const balRes = await api.get('/wallet/balances');
      setBalances(balRes.data.balances || []);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
        status: error.response?.status,
      };
    }
  };

  const register = async (email, password, name) => {
    try {
      const baseUrl = await getApiBaseUrl();
      const response = await axios.post(`${baseUrl}/auth/register`, { email, password, name });
      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem('authToken', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      const api = createApiClient(newToken);
      const balRes = await api.get('/wallet/balances');
      setBalances(balRes.data.balances || []);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
        status: error.response?.status,
      };
    }
  };

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    setToken(null);
    setUser(null);
    setBalances([]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, balances, refreshBalances }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
