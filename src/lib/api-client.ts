const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class APIError extends Error {
  status: number;
  data: unknown;

  constructor(data: { message?: string; statusCode?: number }) {
    super(data.message || "API Error");
    this.status = data.statusCode || 500;
    this.data = data;
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
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
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions?.headers,
  };

  // Only add Content-Type if not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Ensure endpoint starts with /api if it doesn't already
  // Handle cases: '/auth/login', 'auth/login', '/api/auth/login'
  let apiEndpoint: string;
  if (endpoint.startsWith("/api/")) {
    // Already has /api/ prefix, use as-is
    apiEndpoint = endpoint;
  } else {
    // Remove leading slash if present, then add /api prefix
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    apiEndpoint = `/api/${cleanEndpoint}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${apiEndpoint}`, {
      ...fetchOptions,
      headers,
      body: isFormData
        ? (body as FormData)
        : body
          ? JSON.stringify(body)
          : undefined,
    });
  } catch (networkError: any) {
    throw new APIError({
      message: `Network error: ${networkError.message}. Please ensure the backend is running at ${API_BASE_URL}`,
      statusCode: 0,
    });
  }

  if (!response.ok) {
    let errorData: any;
    try {
      const text = await response.text();
      errorData = text
        ? JSON.parse(text)
        : { message: `HTTP ${response.status}: ${response.statusText}` };
    } catch {
      errorData = {
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const apiError = new APIError(errorData);
    (apiError as any).status = response.status;
    throw apiError;
  }

  const data = await response.json();
  return data;
}

export async function apiCallNoAuth(
  endpoint: string,
  options?: ApiCallOptions,
) {
  const { body, isFormData, ...fetchOptions } = options || {};

  const headers: Record<string, string> = {
    ...fetchOptions?.headers,
  };

  // Only add Content-Type if not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Ensure endpoint starts with /api if it doesn't already
  // Handle cases: '/auth/login', 'auth/login', '/api/auth/login'
  let apiEndpoint: string;
  if (endpoint.startsWith("/api/")) {
    // Already has /api/ prefix, use as-is
    apiEndpoint = endpoint;
  } else {
    // Remove leading slash if present, then add /api prefix
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    apiEndpoint = `/api/${cleanEndpoint}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${apiEndpoint}`, {
      ...fetchOptions,
      headers,
      body: isFormData
        ? (body as FormData)
        : body
          ? JSON.stringify(body)
          : undefined,
    });
  } catch (networkError: any) {
    throw new APIError({
      message: `Network error: ${networkError.message}. Please ensure the backend is running at ${API_BASE_URL}`,
      statusCode: 0,
    });
  }

  if (!response.ok) {
    let errorData: any;
    try {
      const text = await response.text();
      errorData = text
        ? JSON.parse(text)
        : { message: `HTTP ${response.status}: ${response.statusText}` };
    } catch {
      errorData = {
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    const apiError = new APIError(errorData);
    (apiError as any).status = response.status;
    throw apiError;
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: (endpoint: string) => apiCall(endpoint, { method: "GET" }),
  post: (endpoint: string, data?: unknown) =>
    apiCall(endpoint, { method: "POST", body: data }),
  put: (endpoint: string, data?: unknown) =>
    apiCall(endpoint, { method: "PUT", body: data }),
  patch: (endpoint: string, data?: unknown) =>
    apiCall(endpoint, { method: "PATCH", body: data }),
  delete: (endpoint: string) => apiCall(endpoint, { method: "DELETE" }),
};
