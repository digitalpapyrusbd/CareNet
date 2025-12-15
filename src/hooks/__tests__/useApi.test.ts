import { renderHook, act, waitFor } from '@testing-library/react';
import { useApi, usePaginatedApi } from '@/hooks/useApi';

describe('useApi Hook', () => {
  describe('Basic functionality', () => {
    it('should initialize with null data and not loading', () => {
      const mockApiFunction = jest.fn().mockResolvedValue({ data: 'test' });
      const { result } = renderHook(() => useApi(mockApiFunction));

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should execute API function successfully', async () => {
      const mockData = { id: '1', name: 'Test' };
      const mockApiFunction = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() => useApi(mockApiFunction));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockApiFunction).toHaveBeenCalledTimes(1);
    });

    it('should handle errors correctly', async () => {
      const mockError = new Error('API Error');
      const mockApiFunction = jest.fn().mockRejectedValue(mockError);
      const { result } = renderHook(() => useApi(mockApiFunction));

      await act(async () => {
        await expect(result.current.execute()).rejects.toThrow('API Error');
      });

      await waitFor(() => {
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toEqual(mockError);
      });
    });

    it('should set loading state while executing', async () => {
      let resolveFunction: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolveFunction = resolve;
      });
      const mockApiFunction = jest.fn().mockReturnValue(promise);
      const { result } = renderHook(() => useApi(mockApiFunction));

      act(() => {
        result.current.execute();
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolveFunction!({ data: 'test' });
        await promise;
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('Options', () => {
    it('should call onSuccess callback', async () => {
      const mockData = { id: '1', name: 'Test' };
      const mockApiFunction = jest.fn().mockResolvedValue(mockData);
      const onSuccess = jest.fn();
      
      const { result } = renderHook(() =>
        useApi(mockApiFunction, { onSuccess })
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });

    it('should call onError callback', async () => {
      const mockError = new Error('API Error');
      const mockApiFunction = jest.fn().mockRejectedValue(mockError);
      const onError = jest.fn();
      
      const { result } = renderHook(() =>
        useApi(mockApiFunction, { onError })
      );

      await expect(
        act(async () => {
          await result.current.execute();
        })
      ).rejects.toThrow();

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should execute immediately if immediate option is true', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue({ data: 'test' });
      
      renderHook(() => useApi(mockApiFunction, { immediate: true }));

      await waitFor(() => {
        expect(mockApiFunction).toHaveBeenCalled();
      });
    });

    it('should not execute immediately if immediate option is false', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue({ data: 'test' });
      
      renderHook(() => useApi(mockApiFunction, { immediate: false }));

      await new Promise((resolve) => setTimeout(resolve, 100));
      
      expect(mockApiFunction).not.toHaveBeenCalled();
    });
  });

  describe('Reset functionality', () => {
    it('should reset state to initial values', async () => {
      const mockData = { id: '1', name: 'Test' };
      const mockApiFunction = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() => useApi(mockApiFunction));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(mockData);

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Execute with arguments', () => {
    it('should pass arguments to API function', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue({ data: 'test' });
      const { result } = renderHook(() => useApi(mockApiFunction));

      await act(async () => {
        await result.current.execute('arg1', 'arg2', 123);
      });

      expect(mockApiFunction).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });
  });

  describe('Error handling', () => {
    it('should convert non-Error objects to Error', async () => {
      const mockApiFunction = jest.fn().mockRejectedValue('String error');
      const { result } = renderHook(() => useApi(mockApiFunction));

      await act(async () => {
        await expect(result.current.execute()).rejects.toThrow('An error occurred');
      });

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe('An error occurred');
      });
    });
  });
});

describe('usePaginatedApi Hook', () => {
  const createMockPaginatedResponse = (page: number, limit: number) => ({
    data: Array.from({ length: limit }, (_, i) => ({
      id: `${page}-${i}`,
      name: `Item ${page}-${i}`,
    })),
    pagination: {
      page,
      limit,
      total: 100,
      totalPages: Math.ceil(100 / limit),
    },
  });

  describe('Basic functionality', () => {
    it('should initialize with default page and limit', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue(
        createMockPaginatedResponse(1, 10)
      );
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.page).toBe(1);
        expect(result.current.limit).toBe(10);
      });
    });

    it('should fetch data on mount', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue(
        createMockPaginatedResponse(1, 10)
      );
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockApiFunction).toHaveBeenCalledWith(1, 10);
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.data).toHaveLength(10);
    });

    it('should use custom initial page and limit', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue(
        createMockPaginatedResponse(2, 20)
      );
      const { result } = renderHook(() =>
        usePaginatedApi(mockApiFunction, { initialPage: 2, initialLimit: 20 })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockApiFunction).toHaveBeenCalledWith(2, 20);
    });
  });

  describe('Pagination controls', () => {
    it('should calculate hasNextPage correctly', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue(
        createMockPaginatedResponse(1, 10)
      );
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(false);
    });

    it('should navigate to next page', async () => {
      const mockApiFunction = jest.fn()
        .mockResolvedValueOnce(createMockPaginatedResponse(1, 10))
        .mockResolvedValueOnce(createMockPaginatedResponse(2, 10));
      
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        result.current.nextPage();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.page).toBe(2);
      });

      expect(mockApiFunction).toHaveBeenCalledWith(2, 10);
    });

    it('should navigate to previous page', async () => {
      const mockApiFunction = jest.fn()
        .mockResolvedValueOnce(createMockPaginatedResponse(2, 10))
        .mockResolvedValueOnce(createMockPaginatedResponse(1, 10));
      
      const { result } = renderHook(() =>
        usePaginatedApi(mockApiFunction, { initialPage: 2 })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        result.current.previousPage();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.page).toBe(1);
      });

      expect(mockApiFunction).toHaveBeenCalledWith(1, 10);
    });

    it('should not go to next page if no next page', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue(
        createMockPaginatedResponse(10, 10)
      );
      
      const { result } = renderHook(() =>
        usePaginatedApi(mockApiFunction, { initialPage: 10 })
      );

      await waitFor(() => {
        expect(result.current.hasNextPage).toBe(false);
      });

      await act(async () => {
        result.current.nextPage();
        await Promise.resolve();
      });

      expect(result.current.page).toBe(10);
    });

    it('should not go to previous page if on first page', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue(
        createMockPaginatedResponse(1, 10)
      );
      
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.hasPreviousPage).toBe(false);
      });

      await act(async () => {
        result.current.previousPage();
        await Promise.resolve();
      });

      expect(result.current.page).toBe(1);
    });
  });

  describe('Page and limit setters', () => {
    it('should update page when setPage is called', async () => {
      const mockApiFunction = jest.fn()
        .mockResolvedValueOnce(createMockPaginatedResponse(1, 10))
        .mockResolvedValueOnce(createMockPaginatedResponse(3, 10));
      
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        result.current.setPage(3);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.page).toBe(3);
      });
    });

    it('should update limit when setLimit is called', async () => {
      const mockApiFunction = jest.fn()
        .mockResolvedValueOnce(createMockPaginatedResponse(1, 10))
        .mockResolvedValueOnce(createMockPaginatedResponse(1, 20));
      
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        result.current.setLimit(20);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.limit).toBe(20);
      });
    });
  });

  describe('Refresh functionality', () => {
    it('should refresh current page data', async () => {
      const mockApiFunction = jest.fn()
        .mockResolvedValueOnce(createMockPaginatedResponse(1, 10))
        .mockResolvedValueOnce(createMockPaginatedResponse(1, 10));
      
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockApiFunction).toHaveBeenCalledTimes(1);

      await act(async () => {
        result.current.refresh();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(mockApiFunction).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle API errors', async () => {
      const mockError = new Error('Pagination API Error');
      const mockApiFunction = jest.fn().mockRejectedValue(mockError);
      const { result } = renderHook(() => usePaginatedApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeNull();
    });

    it('should call onError callback on error', async () => {
      const mockError = new Error('API Error');
      const mockApiFunction = jest.fn().mockRejectedValue(mockError);
      const onError = jest.fn();
      
      renderHook(() =>
        usePaginatedApi(mockApiFunction, { onError })
      );

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(mockError);
      });
    });
  });

  describe('Options', () => {
    it('should call onSuccess callback', async () => {
      const mockData = createMockPaginatedResponse(1, 10);
      const mockApiFunction = jest.fn().mockResolvedValue(mockData);
      const onSuccess = jest.fn();
      
      renderHook(() =>
        usePaginatedApi(mockApiFunction, { onSuccess })
      );

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockData);
      });
    });

    it('should not fetch immediately if immediate is false', async () => {
      const mockApiFunction = jest.fn().mockResolvedValue(
        createMockPaginatedResponse(1, 10)
      );
      
      renderHook(() =>
        usePaginatedApi(mockApiFunction, { immediate: false })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      
      expect(mockApiFunction).not.toHaveBeenCalled();
    });
  });
});
