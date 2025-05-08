// Enhanced API client for the Swap Trade Platform with TypeScript types
import type {
  User,
  Post,
  SwapRequest,
  Notification
} from "./types";

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

// Base API URL - using your environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API || 'https://liwedoc.vercel.app/';

// Helper function to handle API responses
const handleResponse = async (response: Response): Promise<any> => {
  // First check if the response is ok (status in the range 200-299)
  if (!response.ok) {
    // Try to parse the error response as JSON
    try {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || errorData.message || 'API request failed');
    } catch (e) {
      // If parsing fails, throw a generic error with the status
      throw new Error(`API request failed with status ${response.status}`);
    }
  }

  // For successful responses, parse and return the JSON
  return response.json();
};

// Generic fetch function with error handling
const fetchAPI = async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

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
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return handleResponse(response);
  } catch (error: unknown) {
    // Handle abort errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
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

    return fetchAPI('/api/items', {
      method: 'POST',
      headers: {
        // Don't set Content-Type when using FormData, browser will set it with boundary
      },
      body: formData,
    });
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
  return apiClient.items.getItems(params);
};

export const fetchItemById = async (id: string): Promise<Post> => {
  return apiClient.items.getItem(id);
};

export const fetchUserItems = async (userId: string): Promise<Post[]> => {
  return apiClient.items.getUserItems(userId);
};

export const createItem = async (itemData: ItemData, images?: File[]): Promise<Post> => {
  return apiClient.items.createItem(itemData, images);
};

export const updateItem = async (itemId: string, itemData: Partial<ItemData>, images?: File[]): Promise<Post> => {
  return apiClient.items.updateItem(itemId, itemData, images);
};

export const deleteItem = async (itemId: string): Promise<{ message: string }> => {
  return apiClient.items.deleteItem(itemId);
};

// Services compatibility functions
export const fetchServices = async (params?: PaginationParams): Promise<PaginatedResponse<Post>> => {
  return apiClient.services.getServices(params);
};

export const fetchServiceById = async (id: string): Promise<Post> => {
  return apiClient.services.getService(id);
};

export const fetchUserServices = async (userId: string): Promise<Post[]> => {
  return apiClient.services.getUserServices(userId);
};

export const createService = async (serviceData: ServiceData, images?: File[]): Promise<Post> => {
  return apiClient.services.createService(serviceData, images);
};

export const updateService = async (serviceId: string, serviceData: Partial<ServiceData>, images?: File[]): Promise<Post> => {
  return apiClient.services.updateService(serviceId, serviceData, images);
};

export const deleteService = async (serviceId: string): Promise<{ message: string }> => {
  return apiClient.services.deleteService(serviceId);
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