import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import axios from 'axios';

const STORAGE_KEY = 'apiBaseUrl';

let onUnauthorized = null;

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export function getUnauthorizedHandler() {
  return onUnauthorized;
}

export const NETWORK_ERROR_MESSAGE = 'Server unreachable. Check connection and retry.';

function isNetworkError(error) {
  return !error.response && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message === 'Network Error');
}

// Detect host IP from Expo
function detectHostIP() {
  if (Platform.OS === 'web') {
    return 'localhost';
  }

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.hostUri;
  const debuggerHost = Constants.expoConfig?.debuggerHost || Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const parts = hostUri.split(':');
    if (parts.length > 0 && parts[0]) return parts[0];
  }
  if (debuggerHost) {
    const parts = debuggerHost.split(':');
    if (parts.length > 0 && parts[0]) return parts[0];
  }
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  return null;
}

export async function getApiBaseUrl() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  if (Platform.OS === 'web') {
    return 'http://localhost:3010';
  }
  const hostIP = detectHostIP();
  if (hostIP) {
    return `http://${hostIP}:3010`;
  }
  return 'http://localhost:3010';
}

export async function setApiBaseUrl(url) {
  await AsyncStorage.setItem(STORAGE_KEY, url);
}

export function createApiClient(token) {
  const client = axios.create();

  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  client.interceptors.request.use(async (config) => {
    const baseURL = await getApiBaseUrl();
    config.baseURL = baseURL;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        try {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        } catch (e) {
          // ignore storage errors
        }
        if (typeof onUnauthorized === 'function') {
          onUnauthorized();
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export function getNormalizedErrorMessage(error) {
  if (isNetworkError(error)) {
    return NETWORK_ERROR_MESSAGE;
  }
  return error.response?.data?.error || error.message || 'Request failed';
}
