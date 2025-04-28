// Define TypeScript types based on provided schemas

export interface Admin {
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface User {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'restaurant' | 'delivery';
  addresses?: any[];
  favorites?: string[];
  orderHistory?: string[];
  restaurantId?: string;
  verified?: boolean;
  resetToken?: string;
  tokenExpiry?: Date;
  isActive: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine?: string;
  location?: string;
  phone?: string;
  isOpen: boolean;
  rating?: number;
  deliveryTime?: number;
  image?: string;
  freeDelivery?: boolean;
}

export interface MenuItem {
  id: string | null;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image?: string;
}

export interface Order {
  id?: string;
  userId: string;
  restaurantId: string;
  items: string[];
  status: string;
  createdAt?: Date;
  total?: number;
  deliveryAddress?: string;
  estimatedDeliveryTime?: number;
}

export interface Review {
  userId: string;
  restaurantId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}