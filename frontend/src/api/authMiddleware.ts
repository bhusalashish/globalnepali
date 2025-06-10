import { store } from '../store/store';

interface AuthHeaders {
  'Content-Type': string;
  'Authorization'?: string;
}

export const getAuthHeaders = (): AuthHeaders => {
  const state = store.getState();
  const token = state.auth.token;

  return token
    ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    : {
        'Content-Type': 'application/json',
      };
};

export const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Token expired or invalid
    store.dispatch({ type: 'auth/logout' });
    throw new Error('Session expired. Please login again.');
  }
  return response;
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  return handleResponse(response);
}; 