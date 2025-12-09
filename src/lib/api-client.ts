const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class APIError extends Error {
  status: number;
  data: unknown;

  constructor(data: { message?: string; statusCode?: number }) {
    super(data.message || 'API Error');
    this.status = data.statusCode || 500;
    this.data = data;
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

interface ApiCallOptions {
  method?: string;
  body?: unknown;
  isFormData?: boolean;
  headers?: Record<string, string>;
}

export async function apiCall(endpoint: string, options?: ApiCallOptions) {
  const token = getAuthToken();
  const { body, isFormData, ...fetchOptions } = options || {};
  
  const headers: Record<string, string> = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...fetchOptions?.headers,
  };

  // Only add Content-Type if not FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new APIError(errorData);
  }
  
  return response.json();
}

export async function apiCallNoAuth(endpoint: string, options?: ApiCallOptions) {
  const { body, isFormData, ...fetchOptions } = options || {};
  
  const headers: Record<string, string> = {
    ...fetchOptions?.headers,
  };

  // Only add Content-Type if not FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new APIError(errorData);
  }
  
  return response.json();
}

// Convenience methods
export const api = {
  get: (endpoint: string) => apiCall(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: unknown) => 
    apiCall(endpoint, { method: 'POST', body: data }),
  put: (endpoint: string, data?: unknown) => 
    apiCall(endpoint, { method: 'PUT', body: data }),
  patch: (endpoint: string, data?: unknown) => 
    apiCall(endpoint, { method: 'PATCH', body: data }),
  delete: (endpoint: string) => apiCall(endpoint, { method: 'DELETE' }),
};


