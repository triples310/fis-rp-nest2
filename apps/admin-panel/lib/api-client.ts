/**
 * API Client
 * 統一管理所有 API 請求
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * API 錯誤類別
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 通用 Fetch 包裝
 */
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('accessToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `HTTP Error ${response.status}`,
      errorData
    );
  }

  return response;
}

/**
 * API Client 方法
 */
export const apiClient = {
  /**
   * GET 請求
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetchWithAuth(endpoint);
    return response.json();
  },

  /**
   * POST 請求
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  /**
   * PUT 請求
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  /**
   * PATCH 請求
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  /**
   * DELETE 請求
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'DELETE',
    });
    return response.json();
  },
};

/**
 * 設定 Token
 */
export function setAuthToken(token: string) {
  localStorage.setItem('accessToken', token);
}

/**
 * 清除 Token
 */
export function clearAuthToken() {
  localStorage.removeItem('accessToken');
}

/**
 * 取得 Token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}
