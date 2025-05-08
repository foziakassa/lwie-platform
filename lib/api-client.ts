/**
 * API Client for Swap Trade Platform
 * 
 * This module provides a comprehensive API client for interacting with the backend services.
 * It supports both real API calls and mock data for development purposes.
 */

import type { 
  User, 
  Post, 
  SwapRequest, 
  Notification 
} from "./types";

// Import mock data
import { 
  mockItems, 
  mockServices, 
  mockUsers, 
  mockSwapRequests, 
  mockNotifications 
} from "./mock-data";

// Event emitter for real-time updates
import { EventEmitter } from 'events';

// Create a global event emitter for real-time updates
export const dataEvents = new EventEmitter();

// Additional types needed for the API client
interface Message {
  id: string;
  swap_request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Favorite {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

interface PaginationParams {
  limit?: number;
  offset?: number;
}

interface SearchParams extends PaginationParams {
  q?: string;
  type?: 'item' | 'service';
  category?: string;
  min_price?: number;
  max_price?: number;
  condition?: string;
  location?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

interface ApiError {
  error: string;
  message?: string;
  details?: string | string[];
  stack?: string;
}

interface LoginCredentials {
  Email: string;
  Password: string;
}

interface RegisterData {
  Firstname: string;
  Lastname: string;
  Email: string;
  Password: string;
  Role?: string;
}

interface UpdateUserData {
  Firstname?: string;
  Lastname?: string;
  Email?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

interface ItemData {
  user_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price?: number;
  condition?: string;
  city?: string;
  subcity?: string;
  location?: string;
  item_details?: Record<string, any>;
  trade_preferences?: Record<string, any>;
  contact_info?: Record<string, any>;
  status?: "draft" | "published" | "archived";
  image_urls?: string[] | string;
}

interface ServiceData {
  user_id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  city?: string;
  subcity?: string;
  location?: string;
  service_details?: Record<string, any>;
  trade_preferences?: Record<string, any>;
  contact_info?: Record<string, any>;
  status?: "draft" | "published" | "archived";
  image_urls?: string[] | string;
}

interface SwapRequestData {
  post_id: string;
  requester_id: string;
  message: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
}

interface MessageData {
  swap_request_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
}

interface FavoriteData {
  user_id: string;
  post_id: string;
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Configuration
const config = {
  // IMPORTANT: Set to true to use mock data when API is unavailable
  useMockData: true,
  // Log detailed API requests for debugging
  debugMode: true,
  // API timeout in milliseconds
  timeout: 3000,
  // Force mock data even for successful API calls (for testing)
  forceMockData: false
};

// Base API URL - using your environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API || 'https://liwedoc.vercel.app/';

/**
 * Get mock data based on endpoint and method
 * 
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @returns Mock data for the specified endpoint
 */
const getMockData = (endpoint: string, method: string = 'GET'): any => {
  if (config.debugMode) {
    console.log(`Using mock data for ${method} ${endpoint}`);
  }
  
  // Items endpoints
  if (endpoint.startsWith('/api/items')) {
    if (endpoint === '/api/items' && method === 'GET') {
      return { 
        results: mockItems,
        pagination: { 
          total: mockItems.length, 
          limit: 10, 
          offset: 0, 
          has_more: false 
        } 
      };
    } else if (endpoint.match(/\/api\/items\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const itemId = endpoint.split('/').pop();
      const mockItem = mockItems.find(item => item.id === itemId) || mockItems[0];
      return mockItem;
    } else if (endpoint.match(/\/api\/items\/user\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const userId = endpoint.split('/').pop();
      return mockItems.filter(item => item.user_id === userId);
    } else if (endpoint === '/api/items' && method === 'POST') {
      return {
        ...mockItems[0],
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }
  
  // Services endpoints
  if (endpoint.startsWith('/api/services')) {
    if (endpoint === '/api/services' && method === 'GET') {
      return { 
        results: mockServices,
        pagination: { 
          total: mockServices.length, 
          limit: 10, 
          offset: 0, 
          has_more: false 
        } 
      };
    } else if (endpoint.match(/\/api\/services\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const serviceId = endpoint.split('/').pop();
      const mockService = mockServices.find(service => service.id === serviceId) || mockServices[0];
      return mockService;
    } else if (endpoint.match(/\/api\/services\/user\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const userId = endpoint.split('/').pop();
      return mockServices.filter(service => service.user_id === userId);
    } else if (endpoint === '/api/services' && method === 'POST') {
      return {
        ...mockServices[0],
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }
  
  // User endpoints
  if (endpoint.startsWith('/api/users')) {
    if (endpoint.match(/\/api\/users\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const userId = endpoint.split('/').pop();
      const mockUser = mockUsers.find(user => user.id === userId) || mockUsers[0];
      return mockUser;
    }
  }
  
  // Swap request endpoints
  if (endpoint.startsWith('/api/swap-requests')) {
    if (endpoint === '/api/swap-requests' && method === 'GET') {
      return { 
        results: mockSwapRequests,
        pagination: { 
          total: mockSwapRequests.length, 
          limit: 10, 
          offset: 0, 
          has_more: false 
        } 
      };
    } else if (endpoint.match(/\/api\/swap-requests\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const requestId = endpoint.split('/').pop();
      const mockRequest = mockSwapRequests.find(req => req.id === requestId) || mockSwapRequests[0];
      return mockRequest;
    }
  }
  
  // Notifications endpoints
  if (endpoint.startsWith('/api/notifications')) {
    if (endpoint.match(/\/api\/notifications\/user\/[a-zA-Z0-9-]+$/) && method === 'GET') {
      const userId = endpoint.split('/').pop();
      return mockNotifications.filter(notification => notification.user_id === userId);
    }
  }
  
  // Search endpoints
  if (endpoint.startsWith('/api/search')) {
    return { 
      results: [...mockItems, ...mockServices],
      pagination: { 
        total: mockItems.length + mockServices.length, 
        limit: 10, 
        offset: 0, 
        has_more: false 
      } 
    };
  }
  
  // Default empty response
  return method === 'GET' ? {} : { id: `mock-${Date.now()}` };
};

/**
 * Generic fetch function with error handling and fallbacks
 * 
 * @param endpoint - API endpoint
 * @param options - Fetch options
 * @returns Promise with API response
 */
const fetchAPI = async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
  // Log the request in debug mode
  if (config.debugMode) {
    console.log(`API Request: ${method} ${url}`);
    if (options.body) {
      console.log('Request Body:', options.body instanceof FormData ? 'FormData object' : options.body);
    }
  }
  
  // If forceMockData is true, immediately return mock data
  if (config.forceMockData) {
    return getMockData(endpoint, method);
  }
  
  // IMPORTANT: Always return mock data for now to avoid fetch errors
  if (config.useMockData) {
    return getMockData(endpoint, method);
  }
  
  try {
    // Default options
    const defaultOptions: FetchOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    // Merge options
    const fetchOptions: FetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    
    // Remove Content-Type header if FormData is being sent
    if (options.body instanceof FormData && fetchOptions.headers) {
      delete fetchOptions.headers['Content-Type'];
    }
    
    // Add request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    try {
      if (!url || typeof url !== 'string') {
        throw new Error(`Invalid URL for fetch: ${url}`);
      }
      
      console.log(`Fetching URL: ${url}`);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Check if response is ok
      if (!response.ok) {
        // Try to parse the error response as JSON
        try {
          const errorData: ApiError = await response.json();
          throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`);
        } catch (e) {
          // If parsing fails, throw a generic error with the status
          throw new Error(`API request failed with status ${response.status}`);
        }
      }
      
      // For successful responses, parse and return the JSON
      return await response.json();
    } catch (fetchError) {
      // If fetch fails and useMockData is true, return mock data
      if (config.useMockData) {
        if (config.debugMode) {
          console.warn(`Fetch failed for ${method} ${endpoint}, using mock data:`, fetchError);
        }
        return getMockData(endpoint, method);
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    // Log the error in debug mode
    if (config.debugMode) {
      console.error(`API Error for ${url}:`, error);
    }
    
    // Handle abort errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Request timed out after ${config.timeout}ms: ${url}`);
      
      // If useMockData is true, return mock data for timeouts
      if (config.useMockData) {
        return getMockData(endpoint, method);
      }
      
      throw new Error(`Request timed out after ${config.timeout}ms: ${url}`);
    }
    
    // For any error, if useMockData is true, return mock data
    if (config.useMockData) {
      return getMockData(endpoint, method);
    }
    
    // Otherwise, throw the error
    throw error;
  }
};

// User API functions
const userAPI = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    return fetchAPI('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  register: async (userData: RegisterData): Promise<User> => {
    return fetchAPI('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  getUser: async (userId: string): Promise<User> => {
    return fetchAPI(`/api/users/${userId}`);
  },
  
  updateUser: async (userId: string, userData: UpdateUserData): Promise<User> => {
    return fetchAPI(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  changePassword: async (userId: string, passwordData: PasswordChangeData): Promise<{ message: string }> => {
    return fetchAPI(`/api/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};

// Items API functions
const itemsAPI = {
  getItems: async (params: PaginationParams = {}): Promise<PaginatedResponse<Post>> => {
    // Convert params object to query string
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return fetchAPI(`/api/items${queryString ? `?${queryString}` : ''}`);
  },
  
  getItem: async (itemId: string): Promise<Post> => {
    return fetchAPI(`/api/items/${itemId}`);
  },
  
  createItem: async (itemData: ItemData, images?: File[]): Promise<Post> => {
    try {
      // Handle form data with images
      const formData = new FormData();
      
      // Add item data
      Object.keys(itemData).forEach(key => {
        // Handle nested objects by stringifying them
        if (typeof itemData[key as keyof ItemData] === 'object' && itemData[key as keyof ItemData] !== null && !(itemData[key as keyof ItemData] instanceof File)) {
          formData.append(key, JSON.stringify(itemData[key as keyof ItemData]));
        } else {
          formData.append(key, String(itemData[key as keyof ItemData]));
        }
      });
      
      // Add images
      if (images && images.length) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      // Log form data in debug mode
      if (config.debugMode) {
        console.log('Creating item with data:', itemData);
        console.log('Number of images:', images?.length || 0);
      }
      
      // Make the API request
      let result;
      
      if (config.useMockData) {
        // Use mock data
        result = {
          ...mockItems[0],
          id: `mock-${Date.now()}`,
          title: itemData.title,
          description: itemData.description,
          category: itemData.category,
          user_id: itemData.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Add to mock items for immediate display
        mockItems.unshift(result);
        
        // Emit event for real-time updates
        dataEvents.emit('item-created', result);
      } else {
        // Use real API
        result = await fetchAPI('/api/items', {
          method: 'POST',
          body: formData,
        });
        
        // Emit event for real-time updates
        dataEvents.emit('item-created', result);
      }
      
      return result;
    } catch (error) {
      console.error('Error in createItem:', error);
      
      // If using mock data, return a mock item
      if (config.useMockData) {
        console.warn('Using mock data for item creation due to error');
        const mockItem = {
          ...mockItems[0],
          id: `mock-${Date.now()}`,
          title: itemData.title,
          description: itemData.description,
          category: itemData.category,
          user_id: itemData.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Add to mock items for immediate display
        mockItems.unshift(mockItem);
        
        // Emit event for real-time updates
        dataEvents.emit('item-created', mockItem);
        
        return mockItem;
      }
      
      throw error;
    }
  },
  
  updateItem: async (itemId: string, itemData: Partial<ItemData>, images?: File[]): Promise<Post> => {
    // Handle form data with images
    const formData = new FormData();
    
    // Add item data
    Object.keys(itemData).forEach(key => {
      // Handle nested objects by stringifying them
      if (typeof itemData[key as keyof ItemData] === 'object' && itemData[key as keyof ItemData] !== null && !(itemData[key as keyof ItemData] instanceof File)) {
        formData.append(key, JSON.stringify(itemData[key as keyof ItemData]));
      } else if (itemData[key as keyof ItemData] !== undefined) {
        formData.append(key, String(itemData[key as keyof ItemData]));
      }
    });
    
    // Add images
    if (images && images.length) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    // Make the API request
    let result;
    
    if (config.useMockData) {
      // Use mock data
      const index = mockItems.findIndex(item => item.id === itemId);
      if (index !== -1) {
        result = {
          ...mockItems[index],
          ...itemData,
          updated_at: new Date().toISOString(),
        };
        mockItems[index] = result;
        
        // Emit event for real-time updates
        dataEvents.emit('item-updated', result);
      } else {
        result = {
          ...mockItems[0],
          id: itemId,
          ...itemData,
          updated_at: new Date().toISOString(),
        };
      }
    } else {
      // Use real API
      result = await fetchAPI(`/api/items/${itemId}`, {
        method: 'PUT',
        body: formData,
      });
      
      // Emit event for real-time updates
      dataEvents.emit('item-updated', result);
    }
    
    return result;
  },
  
  deleteItem: async (itemId: string): Promise<{ message: string }> => {
    // Make the API request
    let result;
    
    if (config.useMockData) {
      // Use mock data
      const index = mockItems.findIndex(item => item.id === itemId);
      if (index !== -1) {
        mockItems.splice(index, 1);
      }
      result = { message: "Item deleted successfully" };
      
      // Emit event for real-time updates
      dataEvents.emit('item-deleted', { id: itemId });
    } else {
      // Use real API
      result = await fetchAPI(`/api/items/${itemId}`, {
        method: 'DELETE',
      });
      
      // Emit event for real-time updates
      dataEvents.emit('item-deleted', { id: itemId });
    }
    
    return result;
  },
  
  getUserItems: async (userId: string): Promise<Post[]> => {
    return fetchAPI(`/api/items/user/${userId}`);
  },
  
  uploadImages: async (itemId: string, images: File[]): Promise<string[]> => {
    if (!images || images.length === 0) {
      return [];
    }
    
    const formData = new FormData();
    
    // Add the item ID
    formData.append('item_id', itemId);
    
    // Add images
    images.forEach(image => {
      formData.append('images', image);
    });
    
    // Make the request to upload images
    const response = await fetchAPI(`/api/items/${itemId}/images`, {
      method: 'POST',
      body: formData,
    });
    
    return response.image_urls || [];
  },
};

// Services API functions
const servicesAPI = {
  getServices: async (params: PaginationParams = {}): Promise<PaginatedResponse<Post>> => {
    // Convert params object to query string
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return fetchAPI(`/api/services${queryString ? `?${queryString}` : ''}`);
  },
  
  getService: async (serviceId: string): Promise<Post> => {
    return fetchAPI(`/api/services/${serviceId}`);
  },
  
  createService: async (serviceData: ServiceData, images?: File[]): Promise<Post> => {
    try {
      // Handle form data with images
      const formData = new FormData();
      
      // Add service data
      Object.keys(serviceData).forEach(key => {
        // Handle nested objects by stringifying them
        if (typeof serviceData[key as keyof ServiceData] === 'object' && serviceData[key as keyof ServiceData] !== null && !(serviceData[key as keyof ServiceData] instanceof File)) {
          formData.append(key, JSON.stringify(serviceData[key as keyof ServiceData]));
        } else {
          formData.append(key, String(serviceData[key as keyof ServiceData]));
        }
      });
      
      // Add images
      if (images && images.length) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      // Log form data in debug mode
      if (config.debugMode) {
        console.log('Creating service with data:', serviceData);
        console.log('Number of images:', images?.length || 0);
      }
      
      // Make the API request
      let result;
      
      if (config.useMockData) {
        // Use mock data
        result = {
          ...mockServices[0],
          id: `mock-${Date.now()}`,
          title: serviceData.title,
          description: serviceData.description,
          category: serviceData.category,
          user_id: serviceData.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Add to mock services for immediate display
        mockServices.unshift(result);
        
        // Emit event for real-time updates
        dataEvents.emit('service-created', result);
      } else {
        // Use real API
        result = await fetchAPI('/api/services', {
          method: 'POST',
          body: formData,
        });
        
        // Emit event for real-time updates
        dataEvents.emit('service-created', result);
      }
      
      return result;
    } catch (error) {
      console.error('Error in createService:', error);
      
      // If using mock data, return a mock service
      if (config.useMockData) {
        console.warn('Using mock data for service creation due to error');
        const mockService = {
          ...mockServices[0],
          id: `mock-${Date.now()}`,
          title: serviceData.title,
          description: serviceData.description,
          category: serviceData.category,
          user_id: serviceData.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Add to mock services for immediate display
        mockServices.unshift(mockService);
        
        // Emit event for real-time updates
        dataEvents.emit('service-created', mockService);
        
        return mockService;
      }
      
      throw error;
    }
  },
  
  updateService: async (serviceId: string, serviceData: Partial<ServiceData>, images?: File[]): Promise<Post> => {
    // Handle form data with images
    const formData = new FormData();
    
    // Add service data
    Object.keys(serviceData).forEach(key => {
      // Handle nested objects by stringifying them
      if (typeof serviceData[key as keyof ServiceData] === 'object' && serviceData[key as keyof ServiceData] !== null && !(serviceData[key as keyof ServiceData] instanceof File)) {
        formData.append(key, JSON.stringify(serviceData[key as keyof ServiceData]));
      } else if (serviceData[key as keyof ServiceData] !== undefined) {
        formData.append(key, String(serviceData[key as keyof ServiceData]));
      }
    });
    
    // Add images
    if (images && images.length) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    // Make the API request
    let result;
    
    if (config.useMockData) {
      // Use mock data
      const index = mockServices.findIndex(service => service.id === serviceId);
      if (index !== -1) {
        result = {
          ...mockServices[index],
          ...serviceData,
          updated_at: new Date().toISOString(),
        };
        mockServices[index] = result;
        
        // Emit event for real-time updates
        dataEvents.emit('service-updated', result);
      } else {
        result = {
          ...mockServices[0],
          id: serviceId,
          ...serviceData,
          updated_at: new Date().toISOString(),
        };
      }
    } else {
      // Use real API
      result = await fetchAPI(`/api/services/${serviceId}`, {
        method: 'PUT',
        body: formData,
      });
      
      // Emit event for real-time updates
      dataEvents.emit('service-updated', result);
    }
    
    return result;
  },
  
  deleteService: async (serviceId: string): Promise<{ message: string }> => {
    // Make the API request
    let result;
    
    if (config.useMockData) {
      // Use mock data
      const index = mockServices.findIndex(service => service.id === serviceId);
      if (index !== -1) {
        mockServices.splice(index, 1);
      }
      result = { message: "Service deleted successfully" };
      
      // Emit event for real-time updates
      dataEvents.emit('service-deleted', { id: serviceId });
    } else {
      // Use real API
      result = await fetchAPI(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });
      
      // Emit event for real-time updates
      dataEvents.emit('service-deleted', { id: serviceId });
    }
    
    return result;
  },
  
  getUserServices: async (userId: string): Promise<Post[]> => {
    return fetchAPI(`/api/services/user/${userId}`);
  },
  
  uploadImages: async (serviceId: string, images: File[]): Promise<string[]> => {
    if (!images || images.length === 0) {
      return [];
    }
    
    const formData = new FormData();
    
    // Add the service ID
    formData.append('service_id', serviceId);
    
    // Add images
    images.forEach(image => {
      formData.append('images', image);
    });
    
    // Make the request to upload images
    const response = await fetchAPI(`/api/services/${serviceId}/images`, {
      method: 'POST',
      body: formData,
    });
    
    return response.image_urls || [];
  },
};

// Swap Requests API functions
const swapRequestsAPI = {
  getSwapRequests: async (params: PaginationParams = {}): Promise<PaginatedResponse<SwapRequest>> => {
    // Convert params object to query string
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return fetchAPI(`/api/swap-requests${queryString ? `?${queryString}` : ''}`);
  },
  
  getSwapRequest: async (requestId: string): Promise<SwapRequest> => {
    return fetchAPI(`/api/swap-requests/${requestId}`);
  },
  
  createSwapRequest: async (requestData: SwapRequestData): Promise<SwapRequest> => {
    // Make the API request
    let result;
    
    if (config.useMockData) {
      // Use mock data
      result = {
        ...mockSwapRequests[0],
        id: `mock-${Date.now()}`,
        post_id: requestData.post_id,
        requester_id: requestData.requester_id,
        message: requestData.message,
        status: requestData.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock swap requests
      mockSwapRequests.unshift(result);
      
      // Emit event for real-time updates
      dataEvents.emit('swap-request-created', result);
    } else {
      // Use real API
      result = await fetchAPI('/api/swap-requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
      
      // Emit event for real-time updates
      dataEvents.emit('swap-request-created', result);
    }
    
    return result;
  },
  
  updateSwapRequest: async (requestId: string, requestData: Partial<SwapRequestData>): Promise<SwapRequest> => {
    // Make the API request
    let result;
    
    if (config.useMockData) {
      // Use mock data
      const index = mockSwapRequests.findIndex(req => req.id === requestId);
      if (index !== -1) {
        result = {
          ...mockSwapRequests[index],
          ...requestData,
          updated_at: new Date().toISOString(),
        };
        mockSwapRequests[index] = result;
        
        // Emit event for real-time updates
        dataEvents.emit('swap-request-updated', result);
      } else {
        result = {
          ...mockSwapRequests[0],
          id: requestId,
          ...requestData,
          updated_at: new Date().toISOString(),
        };
      }
    } else {
      // Use real API
      result = await fetchAPI(`/api/swap-requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify(requestData),
      });
      
      // Emit event for real-time updates
      dataEvents.emit('swap-request-updated', result);
    }
    
    return result;
  },
  
  getUserSwapRequests: async (userId: string): Promise<SwapRequest[]> => {
    return fetchAPI(`/api/swap-requests/user/${userId}`);
  },
  
  getReceivedSwapRequests: async (userId: string): Promise<SwapRequest[]> => {
    return fetchAPI(`/api/swap-requests/received/${userId}`);
  },
};

// Messages API functions
const messagesAPI = {
  getMessages: async (swapRequestId: string): Promise<Message[]> => {
    return fetchAPI(`/api/messages/swap-request/${swapRequestId}`);
  },
  
  sendMessage: async (messageData: MessageData): Promise<Message> => {
    return fetchAPI('/api/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
  
  markAsRead: async (messageId: string): Promise<Message> => {
    return fetchAPI(`/api/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },
  
  getUserUnreadCount: async (userId: string): Promise<{ count: number }> => {
    return fetchAPI(`/api/messages/unread-count/${userId}`);
  },
};

// Notifications API functions
const notificationsAPI = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    return fetchAPI(`/api/notifications/user/${userId}`);
  },
  
  markAsRead: async (notificationId: string): Promise<Notification> => {
    return fetchAPI(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
  
  markAllAsRead: async (userId: string): Promise<{ message: string }> => {
    return fetchAPI(`/api/notifications/user/${userId}/read-all`, {
      method: 'PUT',
    });
  },
};

// Search API functions
const searchAPI = {
  search: async (params: SearchParams = {}): Promise<PaginatedResponse<Post>> => {
    // Convert params object to query string
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return fetchAPI(`/api/search${queryString ? `?${queryString}` : ''}`);
  },
};

// Analytics API functions
const analyticsAPI = {
  getStats: async (): Promise<{
    stats: {
      total_items: number;
      total_services: number;
      total_users: number;
      total_swap_requests: number;
      completed_swaps: number;
    };
    categories: { category: string; count: number }[];
    recent_activity: any[];
  }> => {
    return fetchAPI('/api/analytics/stats');
  },
  
  getUserActivity: async (userId: string): Promise<{
    posts: {
      total_posts: number;
      total_items: number;
      total_services: number;
      last_post_date: string;
    };
    swap_requests: {
      total_requests: number;
      pending_requests: number;
      accepted_requests: number;
      completed_swaps: number;
    };
    received_requests: {
      total_received: number;
      pending_received: number;
      accepted_received: number;
      completed_received: number;
    };
    popular_posts: Post[];
  }> => {
    return fetchAPI(`/api/analytics/user/${userId}`);
  },
};

// Favorites API functions
const favoritesAPI = {
  getUserFavorites: async (userId: string): Promise<(Favorite & Post)[]> => {
    return fetchAPI(`/api/favorites/user/${userId}`);
  },
  
  addToFavorites: async (favoriteData: FavoriteData): Promise<Favorite> => {
    return fetchAPI('/api/favorites', {
      method: 'POST',
      body: JSON.stringify(favoriteData),
    });
  },
  
  removeFromFavorites: async (userId: string, postId: string): Promise<{ message: string }> => {
    return fetchAPI(`/api/favorites/${userId}/${postId}`, {
      method: 'DELETE',
    });
  },
};

// Export all API functions
const apiClient = {
  user: userAPI,
  items: itemsAPI,
  services: servicesAPI,
  swapRequests: swapRequestsAPI,
  messages: messagesAPI,
  notifications: notificationsAPI,
  search: searchAPI,
  analytics: analyticsAPI,
  favorites: favoritesAPI,
};

// ==========================================
// COMPATIBILITY LAYER FOR EXISTING CODE
// ==========================================

// Items compatibility functions
export const fetchItems = async (params?: PaginationParams): Promise<PaginatedResponse<Post>> => {
  try {
    return await apiClient.items.getItems(params);
  } catch (error) {
    console.error('Error in fetchItems:', error);
    // Return mock data if enabled
    if (config.useMockData) {
      return { 
        results: mockItems,
        pagination: { 
          total: mockItems.length, 
          limit: 10, 
          offset: 0, 
          has_more: false 
        } 
      };
    }
    throw error;
  }
};

export const fetchItemById = async (id: string): Promise<Post> => {
  try {
    return await apiClient.items.getItem(id);
  } catch (error) {
    console.error(`Error in fetchItemById for id ${id}:`, error);
    // Return mock data if enabled
    if (config.useMockData) {
      const mockItem = mockItems.find(item => item.id === id) || mockItems[0];
      return mockItem;
    }
    throw error;
  }
};

export const fetchUserItems = async (userId: string): Promise<Post[]> => {
  try {
    return await apiClient.items.getUserItems(userId);
  } catch (error) {
    console.error(`Error in fetchUserItems for userId ${userId}:`, error);
    // Return mock data if enabled
    if (config.useMockData) {
      return mockItems.filter(item => item.user_id === userId);
    }
    throw error;
  }
};

export const createItem = async (itemData: ItemData, images?: File[]): Promise<Post> => {
  try {
    const safeImages = images || [];
    const result = await apiClient.items.createItem(itemData, safeImages);
    
    // Update UI immediately
    dataEvents.emit('item-created', result);
    
    return result;
  } catch (error) {
    console.error('Error in createItem:', error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockItem = {
        ...mockItems[0],
        id: `mock-${Date.now()}`,
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        user_id: itemData.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock items for immediate display
      mockItems.unshift(mockItem);
      
      // Update UI immediately
      dataEvents.emit('item-created', mockItem);
      
      return mockItem;
    }
    
    throw error;
  }
};

export const updateItem = async (itemId: string, itemData: Partial<ItemData>, images?: File[]): Promise<Post> => {
  try {
    const safeImages = images || [];
    const result = await apiClient.items.updateItem(itemId, itemData, safeImages);
    
    // Update UI immediately
    dataEvents.emit('item-updated', result);
    
    return result;
  } catch (error) {
    console.error(`Error in updateItem for itemId ${itemId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockItem = {
        ...mockItems.find(item => item.id === itemId) || mockItems[0],
        ...itemData,
        updated_at: new Date().toISOString(),
      };
      
      // Update mock items
      const index = mockItems.findIndex(item => item.id === itemId);
      if (index !== -1) {
        mockItems[index] = mockItem;
      }
      
      // Update UI immediately
      dataEvents.emit('item-updated', mockItem);
      
      return mockItem;
    }
    
    throw error;
  }
};

export const deleteItem = async (itemId: string): Promise<{ message: string }> => {
  try {
    const result = await apiClient.items.deleteItem(itemId);
    
    // Update UI immediately
    dataEvents.emit('item-deleted', { id: itemId });
    
    return result;
  } catch (error) {
    console.error(`Error in deleteItem for itemId ${itemId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      // Remove from mock items
      const index = mockItems.findIndex(item => item.id === itemId);
      if (index !== -1) {
        mockItems.splice(index, 1);
      }
      
      // Update UI immediately
      dataEvents.emit('item-deleted', { id: itemId });
      
      return { message: "Item deleted successfully" };
    }
    
    throw error;
  }
};

export const uploadItemImages = async (itemId: string, images: File[]): Promise<string[]> => {
  try {
    // Check if images is undefined or empty
    if (!images || images.length === 0) {
      return [];
    }
    
    const result = await apiClient.items.uploadImages(itemId, images);
    return result;
  } catch (error) {
    console.error(`Error in uploadItemImages for itemId ${itemId}:`, error);
    
    // Return mock image URLs if enabled
    if (config.useMockData) {
      return images.map((_, index) => `/placeholder-image-${index}.jpg`);
    }
    
    throw error;
  }
};

// Services compatibility functions
export const fetchServices = async (params?: PaginationParams): Promise<PaginatedResponse<Post>> => {
  try {
    return await apiClient.services.getServices(params);
  } catch (error) {
    console.error('Error in fetchServices:', error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      return { 
        results: mockServices,
        pagination: { 
          total: mockServices.length, 
          limit: 10, 
          offset: 0, 
          has_more: false 
        } 
      };
    }
    
    throw error;
  }
};

export const fetchServiceById = async (id: string): Promise<Post> => {
  try {
    return await apiClient.services.getService(id);
  } catch (error) {
    console.error(`Error in fetchServiceById for id ${id}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockService = mockServices.find(service => service.id === id) || mockServices[0];
      return mockService;
    }
    
    throw error;
  }
};

export const fetchUserServices = async (userId: string): Promise<Post[]> => {
  try {
    return await apiClient.services.getUserServices(userId);
  } catch (error) {
    console.error(`Error in fetchUserServices for userId ${userId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      return mockServices.filter(service => service.user_id === userId);
    }
    
    throw error;
  }
};

export const createService = async (serviceData: ServiceData, images?: File[]): Promise<Post> => {
  try {
    const safeImages = images || [];
    const result = await apiClient.services.createService(serviceData, safeImages);
    
    // Update UI immediately
    dataEvents.emit('service-created', result);
    
    return result;
  } catch (error) {
    console.error('Error in createService:', error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockService = {
        ...mockServices[0],
        id: `mock-${Date.now()}`,
        title: serviceData.title,
        description: serviceData.description,
        category: serviceData.category,
        user_id: serviceData.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock services for immediate display
      mockServices.unshift(mockService);
      
      // Update UI immediately
      dataEvents.emit('service-created', mockService);
      
      return mockService;
    }
    
    throw error;
  }
};

export const updateService = async (serviceId: string, serviceData: Partial<ServiceData>, images?: File[]): Promise<Post> => {
  try {
    const safeImages = images || [];
    const result = await apiClient.services.updateService(serviceId, serviceData, safeImages);
    
    // Update UI immediately
    dataEvents.emit('service-updated', result);
    
    return result;
  } catch (error) {
    console.error(`Error in updateService for serviceId ${serviceId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockService = {
        ...mockServices.find(service => service.id === serviceId) || mockServices[0],
        ...serviceData,
        updated_at: new Date().toISOString(),
      };
      
      // Update mock services
      const index = mockServices.findIndex(service => service.id === serviceId);
      if (index !== -1) {
        mockServices[index] = mockService;
      }
      
      // Update UI immediately
      dataEvents.emit('service-updated', mockService);
      
      return mockService;
    }
    
    throw error;
  }
};

export const deleteService = async (serviceId: string): Promise<{ message: string }> => {
  try {
    const result = await apiClient.services.deleteService(serviceId);
    
    // Update UI immediately
    dataEvents.emit('service-deleted', { id: serviceId });
    
    return result;
  } catch (error) {
    console.error(`Error in deleteService for serviceId ${serviceId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      // Remove from mock services
      const index = mockServices.findIndex(service => service.id === serviceId);
      if (index !== -1) {
        mockServices.splice(index, 1);
      }
      
      // Update UI immediately
      dataEvents.emit('service-deleted', { id: serviceId });
      
      return { message: "Service deleted successfully" };
    }
    
    throw error;
  }
};

export const uploadServiceImages = async (serviceId: string, images: File[]): Promise<string[]> => {
  try {
    // Check if images is undefined or empty
    if (!images || images.length === 0) {
      return [];
    }
    
    const result = await apiClient.services.uploadImages(serviceId, images);
    return result;
  } catch (error) {
    console.error(`Error in uploadServiceImages for serviceId ${serviceId}:`, error);
    
    // Return mock image URLs if enabled
    if (config.useMockData) {
      return images.map((_, index) => `/placeholder-image-${index}.jpg`);
    }
    
    throw error;
  }
};

// User compatibility functions
export const fetchUser = async (userId: string): Promise<User> => {
  try {
    return await apiClient.user.getUser(userId);
  } catch (error) {
    console.error(`Error in fetchUser for userId ${userId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockUser = mockUsers.find(user => user.id === userId) || mockUsers[0];
      return mockUser;
    }
    
    throw error;
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  try {
    return await apiClient.user.login(credentials);
  } catch (error) {
    console.error('Error in loginUser:', error);
    // For login, we should still throw the error even with mock data
    throw error;
  }
};

export const registerUser = async (userData: RegisterData): Promise<User> => {
  try {
    return await apiClient.user.register(userData);
  } catch (error) {
    console.error('Error in registerUser:', error);
    // For registration, we should still throw the error even with mock data
    throw error;
  }
};

export const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
  try {
    return await apiClient.user.updateUser(userId, userData);
  } catch (error) {
    console.error(`Error in updateUser for userId ${userId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      return {
        ...mockUsers.find(user => user.id === userId) || mockUsers[0],
        ...userData,
      };
    }
    
    throw error;
  }
};

export const changePassword = async (userId: string, passwordData: PasswordChangeData): Promise<{ message: string }> => {
  try {
    return await apiClient.user.changePassword(userId, passwordData);
  } catch (error) {
    console.error(`Error in changePassword for userId ${userId}:`, error);
    // For password changes, we should still throw the error even with mock data
    throw error;
  }
};

// Swap requests compatibility functions
export const fetchSwapRequests = async (params?: PaginationParams): Promise<PaginatedResponse<SwapRequest>> => {
  try {
    return await apiClient.swapRequests.getSwapRequests(params);
  } catch (error) {
    console.error('Error in fetchSwapRequests:', error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      return { 
        results: mockSwapRequests,
        pagination: { 
          total: mockSwapRequests.length, 
          limit: 10, 
          offset: 0, 
          has_more: false 
        } 
      };
    }
    
    throw error;
  }
};

export const fetchSwapRequestById = async (id: string): Promise<SwapRequest> => {
  try {
    return await apiClient.swapRequests.getSwapRequest(id);
  } catch (error) {
    console.error(`Error in fetchSwapRequestById for id ${id}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockRequest = mockSwapRequests.find(req => req.id === id) || mockSwapRequests[0];
      return mockRequest;
    }
    
    throw error;
  }
};

export const fetchUserSwapRequests = async (userId: string): Promise<SwapRequest[]> => {
  try {
    return await apiClient.swapRequests.getUserSwapRequests(userId);
  } catch (error) {
    console.error(`Error in fetchUserSwapRequests for userId ${userId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      return mockSwapRequests.filter(req => req.requester_id === userId);
    }
    
    throw error;
  }
};

export const fetchReceivedSwapRequests = async (userId: string): Promise<SwapRequest[]> => {
  try {
    return await apiClient.swapRequests.getReceivedSwapRequests(userId);
  } catch (error) {
    console.error(`Error in fetchReceivedSwapRequests for userId ${userId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      // This is a simplification - in a real app, you'd need to join posts and swap requests
      return mockSwapRequests;
    }
    
    throw error;
  }
};

export const createSwapRequest = async (requestData: SwapRequestData): Promise<SwapRequest> => {
  try {
    const result = await apiClient.swapRequests.createSwapRequest(requestData);
    
    // Update UI immediately
    dataEvents.emit('swap-request-created', result);
    
    return result;
  } catch (error) {
    console.error('Error in createSwapRequest:', error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockRequest = {
        ...mockSwapRequests[0],
        id: `mock-${Date.now()}`,
        post_id: requestData.post_id,
        requester_id: requestData.requester_id,
        message: requestData.message,
        status: requestData.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock swap requests
      mockSwapRequests.unshift(mockRequest);
      
      // Update UI immediately
      dataEvents.emit('swap-request-created', mockRequest);
      
      return mockRequest;
    }
    
    throw error;
  }
};

export const updateSwapRequest = async (requestId: string, requestData: Partial<SwapRequestData>): Promise<SwapRequest> => {
  try {
    const result = await apiClient.swapRequests.updateSwapRequest(requestId, requestData);
    
    // Update UI immediately
    dataEvents.emit('swap-request-updated', result);
    
    return result;
  } catch (error) {
    console.error(`Error in updateSwapRequest for requestId ${requestId}:`, error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      const mockRequest = {
        ...mockSwapRequests.find(req => req.id === requestId) || mockSwapRequests[0],
        ...requestData,
        updated_at: new Date().toISOString(),
      };
      
      // Update mock swap requests
      const index = mockSwapRequests.findIndex(req => req.id === requestId);
      if (index !== -1) {
        mockSwapRequests[index] = mockRequest;
      }
      
      // Update UI immediately
      dataEvents.emit('swap-request-updated', mockRequest);
      
      return mockRequest;
    }
    
    throw error;
  }
};

// Search compatibility functions
export const searchPosts = async (params: SearchParams): Promise<PaginatedResponse<Post>> => {
  try {
    return await apiClient.search.search(params);
  } catch (error) {
    console.error('Error in searchPosts:', error);
    
    // Return mock data if enabled
    if (config.useMockData) {
      return { 
        results: [...mockItems, ...mockServices],
        pagination: { 
          total: mockItems.length + mockServices.length, 
          limit: 10, 
          offset: 0, 
          has_more: false 
        } 
      };
    }
    
    throw error;
  }
};

// Export the default client
export default apiClient;