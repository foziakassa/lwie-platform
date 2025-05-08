import { Post, SwapRequest, User, Notification } from './types';

// Mock data for development
export const mockItems: Post[] = [
  {
    id: '1',
    user_id: '1',
    type: 'item',
    title: 'Vintage Camera',
    description: 'A beautiful vintage camera in excellent condition',
    category: 'Electronics',
    subcategory: 'Photography',
    condition: 'Good',
    price: 150,
    city: 'New York',
    subcity: 'Manhattan',
    location: 'Downtown',
    images: ['/placeholder-image.jpg'],
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    type: 'item',
    title: 'Mountain Bike',
    description: 'High-quality mountain bike, barely used',
    category: 'Sports',
    subcategory: 'Cycling',
    condition: 'Excellent',
    price: 350,
    city: 'New York',
    subcity: 'Brooklyn',
    location: 'Park Slope',
    images: ['/placeholder-image.jpg'],
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockServices: Post[] = [
  {
    id: '3',
    user_id: '2',
    type: 'service',
    title: 'Professional Photography',
    description: 'Professional photography services for events and portraits',
    category: 'Creative Services',
    subcategory: 'Photography',
    city: 'New York',
    subcity: 'Queens',
    location: 'Astoria',
    images: ['/placeholder-image.jpg'],
    service_details: {
      service_type: 'Photography',
      availability: ['Weekends', 'Evenings'],
      duration: '2-3 hours',
      experience_level: 'Professional',
    },
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '2',
    type: 'service',
    title: 'Web Development',
    description: 'Custom website development and design',
    category: 'Technology',
    subcategory: 'Web Development',
    city: 'New York',
    subcity: 'Manhattan',
    location: 'Midtown',
    images: ['/placeholder-image.jpg'],
    service_details: {
      service_type: 'Development',
      availability: ['Weekdays'],
      duration: 'Project-based',
      experience_level: 'Expert',
    },
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar_url: '/placeholder-avatar.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar_url: '/placeholder-avatar.jpg',
    created_at: new Date().toISOString(),
  },
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    post_id: '1',
    requester_id: '2',
    message: 'I am interested in your vintage camera. Would you like to swap?',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    post_id: '2',
    requester_id: '1',
    message: 'I would like to swap for your mountain bike.',
    status: 'accepted',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: '1',
    type: 'swap_request',
    title: 'New Swap Request',
    message: 'You have received a new swap request for your vintage camera.',
    related_id: '1',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '2',
    type: 'swap_accepted',
    title: 'Swap Request Accepted',
    message: 'Your swap request for the mountain bike has been accepted.',
    related_id: '2',
    is_read: true,
    created_at: new Date().toISOString(),
  },
];