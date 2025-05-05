// app/lib/api-client.ts

// Function to fetch items
export async function fetchItems(filters: any = {}) {
  try {
    const query = new URLSearchParams({
      status: 'published', // Only fetch published items
      ...filters,
    }).toString();
    const response = await fetch(`/api/items?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch items');
    }

    return {
      success: true,
      items: data.items,
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    return { items: [], success: false, error: 'Failed to fetch items' };
  }
}

// Function to fetch services
export async function fetchServices(filters: any = {}) {
  try {
    const query = new URLSearchParams({
      status: 'published', // Only fetch published services
      ...filters,
    }).toString();
    const response = await fetch(`/api/services?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch services');
    }

    return {
      success: true,
      services: data.services,
    };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { services: [], success: false, error: 'Failed to fetch services' };
  }
}

// Get item by ID
export async function fetchItemById(id: string) {
  try {
    const response = await fetch(`/api/items?item_id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }

    const data = await response.json();
    if (!data.success || data.count === 0) {
      return { success: false, error: 'Item not found' };
    }

    return {
      success: true,
      item: data.items[0], // GET with item_id returns an array with one item
    };
  } catch (error) {
    console.error('Error fetching item:', error);
    return { success: false, error: 'Failed to fetch item' };
  }
}

// Get service by ID
export async function fetchServiceById(id: string) {
  try {
    const response = await fetch(`/api/services?service_id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }

    const data = await response.json();
    if (!data.success || data.count === 0) {
      return { success: false, error: 'Service not found' };
    }

    return {
      success: true,
      service: data.services[0], // GET with service_id returns an array with one service
    };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { success: false, error: 'Failed to fetch service' };
  }
}

// Create item
export async function createItem(itemData: any) {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create item, response:', errorText);
      throw new Error(`Failed to create item: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating item:', error);
    return { success: false, error: 'Failed to create item' };
  }
}

// Create service
export async function createService(serviceData: any) {
  try {
    const response = await fetch('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error('Failed to create service');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: 'Failed to create service' };
  }
}

// Upload item images - placeholder implementation
export async function uploadItemImages(files: File[]): Promise<string[]> {
  // TODO: Implement actual upload logic
  console.warn('uploadItemImages is a placeholder function');
  return files.map((file, index) => `https://example.com/uploads/items/${file.name || 'image'}-${index}.jpg`);
}

// Upload service images - placeholder implementation
export async function uploadServiceImages(files: File[]): Promise<string[]> {
  // TODO: Implement actual upload logic
  console.warn('uploadServiceImages is a placeholder function');
  return files.map((file, index) => `https://example.com/uploads/services/${file.name || 'image'}-${index}.jpg`);
}

// Fetch categories
export async function fetchCategories() {
  try {
    const response = await fetch('/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch categories');
    }

    return {
      success: true,
      categories: data.categories,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [], success: false, error: 'Failed to fetch categories' };
  }
}
