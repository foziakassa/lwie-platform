// Enhanced API client for the Swap Trade Platform with TypeScript types
import type { 
  User, 
  Post, 
  SwapRequest, 
  Notification 
} from "./types";

/* Removed import of mock-data due to missing module */
// import { mockItems, mockServices } from "./mock-data";

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
  status?: string;
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
  status?: string;
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
  // Use mock data in development when API is unavailable
  useMockData: true,
  // Log detailed API requests for debugging
  debugMode: true,
  // API timeout in milliseconds
  timeout: 10000,
};

// Base API URL - using your environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API || 'https://liwedoc.vercel.app/';

// Helper function to handle API responses
const handleResponse = async (response: Response): Promise<any> => {
  // First check if the response is ok (status in the range 200-299)
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
  return response.json();
};

// Generic fetch function with error handling and fallbacks
const fetchAPI = async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log the request in debug mode
  if (config.debugMode) {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('Request Body:', options.body);
    }
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
    
    // Add request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    return handleResponse(response);
  } catch (error: unknown) {
    // Log the error in debug mode
    if (config.debugMode) {
      console.error(`API Error for ${url}:`, error);
    }
    
    // Handle abort errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${config.timeout}ms: ${url}`);
    }
    
    // For GET requests, return mock data if enabled
    if (config.useMockData && (options.method === undefined || options.method === 'GET')) {
      console.warn(`Using mock data for ${endpoint} due to fetch error`);
      
      // Return appropriate mock data based on the endpoint
      if (endpoint.includes('/api/items')) {
        if (endpoint.includes('/items/') && endpoint.split('/').length > 3) {
          // Single item request
          const itemId = endpoint.split('/').pop();
          // Removed usage of mockItems due to missing module
          return {} as Post;
        }
        // Items list request
        return { 
          results: [],
          pagination: { 
            total: 0, 
            limit: 10, 
            offset: 0, 
            has_more: false 
          } 
        };
      } else if (endpoint.includes('/api/services')) {
        if (endpoint.includes('/services/') && endpoint.split('/').length > 3) {
          // Single service request
          const serviceId = endpoint.split('/').pop();
          // Removed usage of mockServices due to missing module
          return {} as Post;
        }
        // Services list request
           return { 
             results: [],
             pagination: { 
               total: 0, 
               limit: 10, 
               offset: 0, 
               has_more: false 
             } 
           };
      }
      
      // Default empty response
      return {};
    }
    
    // For POST/PUT/DELETE or if mock data is disabled, throw the error
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
      
      return fetchAPI('/api/items', {
        method: 'POST',
        headers: {
          // Don't set Content-Type when using FormData, browser will set it with boundary
        },
        body: formData,
      });
    } catch (error) {
      console.error('Error in createItem:', error);
      
      // If using mock data, return a mock item
      if (config.useMockData) {
        console.warn('Using mock data for item creation due to error');
        // Removed usage of mockItems due to missing module
        return {} as Post;
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
    
    return fetchAPI(`/api/items/${itemId}`, {
      method: 'PUT',
      headers: {
        // Don't set Content-Type when using FormData, browser will set it with boundary
      },
      body: formData,
    });
  },
  
  deleteItem: async (itemId: string): Promise<{ message: string }> => {
    return fetchAPI(`/api/items/${itemId}`, {
      method: 'DELETE',
    });
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
      headers: {
        // Don't set Content-Type when using FormData, browser will set it with boundary
      },
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
      
      return fetchAPI('/api/services', {
        method: 'POST',
        headers: {
          // Don't set Content-Type when using FormData, browser will set it with boundary
        },
        body: formData,
      });
    } catch (error) {
      console.error('Error in createService:', error);
      
      // If using mock data, return a mock service
      if (config.useMockData) {
        console.warn('Using mock data for service creation due to error');
        // Removed usage of mockServices due to missing module
        return {} as Post;
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
    
    return fetchAPI(`/api/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        // Don't set Content-Type when using FormData, browser will set it with boundary
      },
      body: formData,
    });
  },
  
  deleteService: async (serviceId: string): Promise<{ message: string }> => {
    return fetchAPI(`/api/services/${serviceId}`, {
      method: 'DELETE',
    });
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
      headers: {
        // Don't set Content-Type when using FormData, browser will set it with boundary
      },
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
    return fetchAPI('/api/swap-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
  
  updateSwapRequest: async (requestId: string, requestData: Partial<SwapRequestData>): Promise<SwapRequest> => {
    return fetchAPI(`/api/swap-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
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
    // Return empty data as fallback since mockItems is unavailable
      if (config.useMockData) {
        // Removed usage of mockItems due to missing module
        return { 
          results: [],
          pagination: { 
            total: 0, 
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
    // Return empty object as fallback since mockItems is unavailable
    if (config.useMockData) {
      return {} as Post;
    }
    throw error;
  }
};

export const fetchUserItems = async (userId: string): Promise<Post[]> => {
  try {
    return await apiClient.items.getUserItems(userId);
  } catch (error) {
    console.error(`Error in fetchUserItems for userId ${userId}:`, error);
    // Return empty array as fallback since mockItems is unavailable
    if (config.useMockData) {
      return [];
    }
    throw error;
  }
};

export const createItem = async (itemData: ItemData, images?: File[]): Promise<Post> => {
  try {
    return await apiClient.items.createItem(itemData, images);
  } catch (error) {
    console.error('Error in createItem:', error);
    // Return empty object as fallback since mockItems is unavailable
    if (config.useMockData) {
      return {} as Post;
    }
    throw error;
  }
};

export const updateItem = async (itemId: string, itemData: Partial<ItemData>, images?: File[]): Promise<Post> => {
  return apiClient.items.updateItem(itemId, itemData, images);
};

export const deleteItem = async (itemId: string): Promise<{ message: string }> => {
  return apiClient.items.deleteItem(itemId);
};

export const uploadItemImages = async (itemId: string, images: File[]): Promise<string[]> => {
  try {
    return await apiClient.items.uploadImages(itemId, images);
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
    // Return empty data as fallback since mockServices is unavailable
    if (config.useMockData) {
      // Removed usage of mockServices due to missing module
      return { 
        results: [],
        pagination: { 
          total: 0, 
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
    // Return empty object as fallback since mockServices is unavailable
    if (config.useMockData) {
      return {} as Post;
    }
    throw error;
  }
};

export const fetchUserServices = async (userId: string): Promise<Post[]> => {
  try {
    return await apiClient.services.getUserServices(userId);
  } catch (error) {
    console.error(`Error in fetchUserServices for userId ${userId}:`, error);
    // Return empty array as fallback since mockServices is unavailable
    if (config.useMockData) {
      return [];
    }
    throw error;
  }
};

export const createService = async (serviceData: ServiceData, images?: File[]): Promise<Post> => {
  try {
    return await apiClient.services.createService(serviceData, images);
  } catch (error) {
    console.error('Error in createService:', error);
    // Return empty object as fallback since mockServices is unavailable
    if (config.useMockData) {
      return {} as Post;
    }
    throw error;
  }
};

export const updateService = async (serviceId: string, serviceData: Partial<ServiceData>, images?: File[]): Promise<Post> => {
  return apiClient.services.updateService(serviceId, serviceData, images);
};

export const deleteService = async (serviceId: string): Promise<{ message: string }> => {
  return apiClient.services.deleteService(serviceId);
};

export const uploadServiceImages = async (serviceId: string, images: File[]): Promise<string[]> => {
  try {
    return await apiClient.services.uploadImages(serviceId, images);
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
  return apiClient.user.getUser(userId);
};

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  return apiClient.user.login(credentials);
};

export const registerUser = async (userData: RegisterData): Promise<User> => {
  return apiClient.user.register(userData);
};

export const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
  return apiClient.user.updateUser(userId, userData);
};

export const changePassword = async (userId: string, passwordData: PasswordChangeData): Promise<{ message: string }> => {
  return apiClient.user.changePassword(userId, passwordData);
};

// Swap requests compatibility functions
export const fetchSwapRequests = async (params?: PaginationParams): Promise<PaginatedResponse<SwapRequest>> => {
  return apiClient.swapRequests.getSwapRequests(params);
};

export const fetchSwapRequestById = async (id: string): Promise<SwapRequest> => {
  return apiClient.swapRequests.getSwapRequest(id);
};

export const fetchUserSwapRequests = async (userId: string): Promise<SwapRequest[]> => {
  return apiClient.swapRequests.getUserSwapRequests(userId);
};

export const fetchReceivedSwapRequests = async (userId: string): Promise<SwapRequest[]> => {
  return apiClient.swapRequests.getReceivedSwapRequests(userId);
};

export const createSwapRequest = async (requestData: SwapRequestData): Promise<SwapRequest> => {
  return apiClient.swapRequests.createSwapRequest(requestData);
};

export const updateSwapRequest = async (requestId: string, requestData: Partial<SwapRequestData>): Promise<SwapRequest> => {
  return apiClient.swapRequests.updateSwapRequest(requestId, requestData);
};

// Search compatibility functions
export const searchPosts = async (params: SearchParams): Promise<PaginatedResponse<Post>> => {
  return apiClient.search.search(params);
};

// Export the default client
export default apiClient;