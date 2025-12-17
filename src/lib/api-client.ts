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
  
  // Ensure endpoint starts with /api if it doesn't already
  // Handle cases: '/auth/login', 'auth/login', '/api/auth/login'
  let apiEndpoint: string;
  if (endpoint.startsWith('/api/')) {
    // Already has /api/ prefix, use as-is
    apiEndpoint = endpoint;
  } else {
    // Remove leading slash if present, then add /api prefix
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    apiEndpoint = `/api/${cleanEndpoint}`;
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.ts:45',message:'API call initiated',data:{endpoint:apiEndpoint,baseUrl:API_BASE_URL,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'api-call',hypothesisId:'FRONTEND_BACKEND_CONNECTION'})}).catch(()=>{});
  // #endregion
  
  const response = await fetch(`${API_BASE_URL}${apiEndpoint}`, {
    ...fetchOptions,
    headers,
    body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
  });
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.ts:52',message:'API call response',data:{endpoint:apiEndpoint,status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'api-call',hypothesisId:'FRONTEND_BACKEND_CONNECTION'})}).catch(()=>{});
  // #endregion
  
  if (!response.ok) {
    let errorData: any;
    try {
      const text = await response.text();
      errorData = text ? JSON.parse(text) : { message: `HTTP ${response.status}: ${response.statusText}` };
    } catch {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.ts:66',message:'API call error',data:{endpoint:apiEndpoint,status:response.status,error:errorData,url:`${API_BASE_URL}${apiEndpoint}`},timestamp:Date.now(),sessionId:'debug-session',runId:'api-call',hypothesisId:'FRONTEND_BACKEND_CONNECTION'})}).catch(()=>{});
    // #endregion
    
    const apiError = new APIError(errorData);
    (apiError as any).status = response.status;
    throw apiError;
  }
  
  const data = await response.json();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.ts:64',message:'API call success',data:{endpoint:apiEndpoint,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'api-call',hypothesisId:'FRONTEND_BACKEND_CONNECTION'})}).catch(()=>{});
  // #endregion
  return data;
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
  
  // Ensure endpoint starts with /api if it doesn't already
  // Handle cases: '/auth/login', 'auth/login', '/api/auth/login'
  let apiEndpoint: string;
  if (endpoint.startsWith('/api/')) {
    // Already has /api/ prefix, use as-is
    apiEndpoint = endpoint;
  } else {
    // Remove leading slash if present, then add /api prefix
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    apiEndpoint = `/api/${cleanEndpoint}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${apiEndpoint}`, {
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


