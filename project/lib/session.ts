import type { SessionOptions } from "iron-session";
import { Restaurant } from "@/types/schema"; // Assuming Restaurant type might be needed

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string; // To associate cart items with a specific restaurant
  // restaurantName?: string; // Optional: if you want to display restaurant name in cart easily
}

export interface SessionData {
  // Define your session data structure
  // For example, if you store user info:
  // userId?: string;
  // isLoggedIn?: boolean;
  cart?: CartItem[];
  // You can add other session-related data here
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string, // Must be at least 32 characters long
  cookieName: "myapp-session", // Choose a unique name for your session cookie
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // True in production, false in development
    httpOnly: true, // Recommended for security
    sameSite: "lax", // Or 'strict' or 'none' based on your needs
  },
};

// Helper function to get the cart from the session
export function getCart(session: SessionData | undefined): CartItem[] {
  return session?.cart || [];
}
