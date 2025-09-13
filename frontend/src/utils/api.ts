// frontend/src/utils/api.ts
// Alternative version with generic types for better type safety

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';

export const apiConfig = {
  // Use this for fetch calls in your components
  getApiUrl: (endpoint: string) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // If endpoint already starts with 'api/', don't add it again
    if (cleanEndpoint.startsWith('api/')) {
      const baseWithoutApi = API_BASE.replace(/\/api$/, '');
      return `${baseWithoutApi}/${cleanEndpoint}`;
    }
    
    // Otherwise, use the full API_BASE
    return `${API_BASE}/${cleanEndpoint}`;
  },
  
  // Helper for common fetch operations
  fetch: async (endpoint: string, options?: RequestInit) => {
    const url = apiConfig.getApiUrl(endpoint);
    console.log(`[API] Fetching: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    // Check for maintenance mode
    if (response.status === 503) {
      const data = await response.json();
      if (data.maintenanceMode) {
        // Redirect to maintenance page
        window.location.href = '/maintenance';
        throw new Error('Service under maintenance');
      }
    }
    
    return response;
  },
  
  // GET request helper
  get: async (endpoint: string, options?: RequestInit): Promise<Response> => {
    return apiConfig.fetch(endpoint, { 
      ...options, 
      method: 'GET' 
    });
  },
  
  // POST request helper with generic type
  post: async <T = unknown>(
    endpoint: string, 
    data?: T, 
    options?: RequestInit
  ): Promise<Response> => {
    return apiConfig.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  // PUT request helper with generic type
  put: async <T = unknown>(
    endpoint: string, 
    data?: T, 
    options?: RequestInit
  ): Promise<Response> => {
    return apiConfig.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  // DELETE request helper
  delete: async (endpoint: string, options?: RequestInit): Promise<Response> => {
    return apiConfig.fetch(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};

// Example usage with types in components:
/*
import { apiConfig } from '@/utils/api';

interface College {
  id: string;
  name: string;
  location: string;
}

interface LoginData {
  email: string;
  password: string;
}

// In your component
const fetchColleges = async () => {
  try {
    const response = await apiConfig.get<College[]>('colleges');
    if (response.ok) {
      const data: College[] = await response.json();
      setColleges(data);
    }
  } catch (error) {
    console.error('Error fetching colleges:', error);
  }
};

// For POST with typed data
const login = async (credentials: LoginData) => {
  const response = await apiConfig.post<LoginData>('auth/login', credentials);
  // ...
};
*/