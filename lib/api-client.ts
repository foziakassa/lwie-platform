// Enhanced API client with improved mock data handling
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
  useMockData: false,
  // Log detailed API requests for debugging
  debugMode: true,
  // API timeout in milliseconds
  timeout: 5000,
  // Force mock data even for successful API calls (for testing)
  forceMockData: false
};

// Base API URL - using your environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API || 'https://liwedoc.vercel.app/';

// Function to get mock data based on endpoint
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

// Generic fetch function with error handling and fallbacks
const fetchAPI = async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
  // Log the request in debug mode
  if (config.debugMode) {
    console.log(`API Request: ${method} ${url}`);
    if (options.body) {
      console.log('Request Body:', options.body);
    }
  }
  
  // If forceMockData is true, immediately return mock data
  if (config.forceMockData) {
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
    
    // Add request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    try {
      if (!url || typeof url !== 'string') {
        throw new Error(`Invalid URL for fetch: ${url}`);
      }
      console.log(`Fetching URL: ${url}`);
      let response;
      try {
        if (typeof fetch === "function") {
          response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
          });
        } else {
          throw new Error("Fetch API is not available in this environment.");
        }
      } catch (fetchError) {
        console.error(`Fetch error for URL ${url}:`, fetchError);
        throw fetchError;
      }
      
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
        return {
          ...mockItems[0],
          id: `mock-${Date.now()}`,
          title: itemData.title,
          description: itemData.description,
          category: itemData.category,
          user_id: itemData.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
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
        return {
          ...mockServices[0],
          id: `mock-${Date.now()}`,
          title: serviceData.title,
          description: serviceData.description,
          category: serviceData.category,
          user_id: serviceData.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
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
    return await apiClient.items.createItem(itemData, images);
  } catch (error) {
    console.error('Error in createItem:', error);
    // Return mock data if enabled
    if (config.useMockData) {
      return {
        ...mockItems[0],
        id: `mock-${Date.now()}`,
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        user_id: itemData.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const updateItem = async (itemId: string, itemData: Partial<ItemData>, images?: File[]): Promise<Post> => {
  try {
    return await apiClient.items.updateItem(itemId, itemData, images);
  } catch (error) {
    console.error(`Error in updateItem for itemId ${itemId}:`, error);
    // Return mock data if enabled
    if (config.useMockData) {
      return {
        ...mockItems.find(item => item.id === itemId) || mockItems[0],
        ...itemData,
        updated_at: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const deleteItem = async (itemId: string): Promise<{ message: string }> => {
  try {
    return await apiClient.items.deleteItem(itemId);
  } catch (error) {
    console.error(`Error in deleteItem for itemId ${itemId}:`, error);
    // Return mock data if enabled
    if (config.useMockData) {
      return { message: "Item deleted successfully" };
    }
    throw error;
  }
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
    return await apiClient.services.createService(serviceData, images);
  } catch (error) {
    console.error('Error in createService:', error);
    // Return mock data if enabled
    if (config.useMockData) {
      return {
        ...mockServices[0],
        id: `mock-${Date.now()}`,
        title: serviceData.title,
        description: serviceData.description,
        category: serviceData.category,
        user_id: serviceData.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const updateService = async (serviceId: string, serviceData: Partial<ServiceData>, images?: File[]): Promise<Post> => {
  try {
    return await apiClient.services.updateService(serviceId, serviceData, images);
  } catch (error) {
    console.error(`Error in updateService for serviceId ${serviceId}:`, error);
    // Return mock data if enabled
    if (config.useMockData) {
      return {
        ...mockServices.find(service => service.id === serviceId) || mockServices[0],
        ...serviceData,
        updated_at: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const deleteService = async (serviceId: string): Promise<{ message: string }> => {
  try {
    return await apiClient.services.deleteService(serviceId);
  } catch (error) {
    console.error(`Error in deleteService for serviceId ${serviceId}:`, error);
    // Return mock data if enabled
    if (config.useMockData) {
      return { message: "Service deleted successfully" };
    }
    throw error;
  }
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
    return await apiClient.swapRequests.createSwapRequest(requestData);
  } catch (error) {
    console.error('Error in createSwapRequest:', error);
    // Return mock data if enabled
    if (config.useMockData) {
      return {
        ...mockSwapRequests[0],
        id: `mock-${Date.now()}`,
        post_id: requestData.post_id,
        requester_id: requestData.requester_id,
        message: requestData.message,
        status: requestData.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const updateSwapRequest = async (requestId: string, requestData: Partial<SwapRequestData>): Promise<SwapRequest> => {
  try {
    return await apiClient.swapRequests.updateSwapRequest(requestId, requestData);
  } catch (error) {
    console.error(`Error in updateSwapRequest for requestId ${requestId}:`, error);
    // Return mock data if enabled
    if (config.useMockData) {
      return {
        ...mockSwapRequests.find(req => req.id === requestId) || mockSwapRequests[0],
        ...requestData,
        updated_at: new Date().toISOString(),
      };
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