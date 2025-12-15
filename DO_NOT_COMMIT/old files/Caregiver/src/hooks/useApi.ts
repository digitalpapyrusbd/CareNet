import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, PaginatedResponse } from '@/types';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export const useApi = <T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('An error occurred');
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      options.onError?.(errorObj);
      throw errorObj;
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    reset,
  };
};

// Hook for paginated data
interface UsePaginatedApiOptions<T> extends UseApiOptions<PaginatedResponse<T>> {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginatedApiState<T> extends UseApiState<PaginatedResponse<T>> {
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UsePaginatedApiReturn<T> extends UsePaginatedApiState<T> {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refresh: () => void;
}

export const usePaginatedApi = <T = any>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<PaginatedResponse<T>>,
  options: UsePaginatedApiOptions<T> = {}
): UsePaginatedApiReturn<T> => {
  const [page, setPage] = useState(options.initialPage || 1);
  const [limit, setLimit] = useState(options.initialLimit || 10);
  const [state, setState] = useState<UsePaginatedApiState<T>>({
    data: null,
    loading: false,
    error: null,
    page,
    limit,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(page, limit);
      const hasNextPage = page < result.pagination.totalPages;
      const hasPreviousPage = page > 1;

      setState({
        data: result,
        loading: false,
        error: null,
        page,
        limit,
        hasNextPage,
        hasPreviousPage,
      });
      options.onSuccess?.(result);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('An error occurred');
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      options.onError?.(errorObj);
    }
  }, [apiFunction, page, limit, options]);

  const nextPage = useCallback(() => {
    if (state.hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [state.hasNextPage]);

  const previousPage = useCallback(() => {
    if (state.hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  }, [state.hasPreviousPage]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  return {
    ...state,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    refresh,
  };
};

// Hook for real-time data (WebSocket or polling)
interface UseRealtimeOptions<T> {
  pollingInterval?: number;
  enabled?: boolean;
}

export const useRealtime = <T = any>(
  apiFunction: () => Promise<T>,
  options: UseRealtimeOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('An error occurred');
      setError(errorObj);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options.enabled]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();

      if (options.pollingInterval && options.pollingInterval > 0) {
        const interval = setInterval(fetchData, options.pollingInterval);
        return () => clearInterval(interval);
      }
    }
  }, [fetchData, options.pollingInterval, options.enabled]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for form submission
interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  resetOnSuccess?: boolean;
}

interface UseFormSubmitState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

interface UseFormSubmitReturn<T> extends UseFormSubmitState<T> {
  submit: (data: any) => Promise<T>;
  reset: () => void;
}

export const useFormSubmit = <T = any>(
  submitFunction: (data: any) => Promise<T>,
  options: UseFormSubmitOptions<T> = {}
): UseFormSubmitReturn<T> => {
  const [state, setState] = useState<UseFormSubmitState<T>>({
    loading: false,
    error: null,
    data: null,
  });

  const submit = useCallback(async (formData: any): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await submitFunction(formData);
      setState({
        loading: false,
        error: null,
        data: options.resetOnSuccess ? null : result,
      });
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('An error occurred');
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      options.onError?.(errorObj);
      throw errorObj;
    }
  }, [submitFunction, options]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
};

// Hook for file upload
interface UseFileUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

interface UseFileUploadState {
  loading: boolean;
  error: Error | null;
  progress: number;
  url: string | null;
}

interface UseFileUploadReturn extends UseFileUploadState {
  upload: (file: File) => Promise<string>;
  reset: () => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const [state, setState] = useState<UseFileUploadState>({
    loading: false,
    error: null,
    progress: 0,
    url: null,
  });

  const upload = useCallback(async (file: File): Promise<string> => {
    setState({ loading: true, error: null, progress: 0, url: null });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setState(prev => ({ ...prev, progress }));
            options.onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const url = response.url;
            setState({ loading: false, error: null, progress: 100, url });
            options.onSuccess?.(url);
            resolve(url);
          } else {
            const error = new Error('Upload failed');
            setState(prev => ({ ...prev, loading: false, error }));
            options.onError?.(error);
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          const error = new Error('Upload failed');
          setState(prev => ({ ...prev, loading: false, error }));
          options.onError?.(error);
          reject(error);
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Upload failed');
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      options.onError?.(errorObj);
      throw errorObj;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, progress: 0, url: null });
  }, []);

  return {
    ...state,
    upload,
    reset,
  };
};