import { API_BASE_URL, HTTP_STATUS, API_TIMEOUT } from './api.config';

export interface ApiResponse<T = any> {
  data?: T;
  message: string;
  status: number;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from window.__clerkToken or from Clerk
    const token = (window as any).__clerkToken || '';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        return {
          message: responseData.message || 'Request failed',
          status: response.status,
          errors: responseData.errors || [],
        };
      }

      return {
        data: responseData.data || responseData,
        message: responseData.message || 'Success',
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            message: 'Request timeout',
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          };
        }
        return {
          message: error.message || 'Network error',
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        };
      }

      return {
        message: 'Unknown error occurred',
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = (window as any).__clerkToken || '';
    
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        return {
          message: responseData.message || 'Upload failed',
          status: response.status,
          errors: responseData.errors || [],
        };
      }

      return {
        data: responseData.data || responseData,
        message: responseData.message || 'Upload successful',
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        return {
          message: error.message || 'Upload error',
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        };
      }

      return {
        message: 'Unknown upload error occurred',
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

export const apiClient = new ApiClient();

// Function to set auth token (called from Clerk authentication)
export const setAuthToken = (token: string) => {
  (window as any).__clerkToken = token;
};

// Function to clear auth token
export const clearAuthToken = () => {
  delete (window as any).__clerkToken;
};
