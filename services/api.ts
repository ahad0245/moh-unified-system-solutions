import type { User } from '../types';

const API_BASE_URL = 'https://medical-permits.vercel.app';

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Invalid credentials or server error' }));
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};


export const getAllUsers = async (token: string): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/getAllUsersData`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
      if(response.status === 401) {
          throw new Error('Unauthorized: Invalid token or session expired.');
      }
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  
  // The API might return the user array directly, or nested under a `users` key.
  // This logic handles both common response structures.
  if (Array.isArray(data)) {
    return data;
  }
  
  return data.users || [];
};