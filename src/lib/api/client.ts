type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig extends RequestInit {
  timeout?: number;
  baseURL?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000; // 10 segundos

  constructor(baseURL: string, timeout?: number) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remover slash final
    if (timeout) this.defaultTimeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      baseURL = this.baseURL,
      ...fetchOptions
    } = options;

    const url = `${baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const config: RequestInit = {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`, 
          response.status,
          url
        );
      }

      // Verificar si la respuesta tiene contenido
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return response.text() as T;
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError(`Request timeout after ${timeout}ms`, 408, url);
      }
      
      console.error(`API Error [${url}]:`, error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

class ApiError extends Error {
  constructor(
    message: string, 
    public status?: number, 
    public url?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Instancias para diferentes APIs
export const authApi = new ApiClient(process.env.NEXT_PUBLIC_AUTH_API_URL!)
export const mainApi = new ApiClient(process.env.NEXT_PUBLIC_MAIN_API_URL!);   
export const processApi = new ApiClient(process.env.NEXT_PUBLIC_PROCESS_API_URL!);
export { ApiError };