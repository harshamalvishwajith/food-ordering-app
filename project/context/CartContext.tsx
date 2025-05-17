"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MenuItem, Restaurant } from "@/types/schema"; // Assuming these types exist

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantName: string;
  // restaurantId is already part of MenuItem, ensure it's always populated
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    item: MenuItem,
    restaurant: Pick<Restaurant, "_id" | "name">
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  // Optional: Add a function to get items by restaurant if needed for multi-restaurant cart handling
  // getRestaurantCartItems: (restaurantId: string) => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from sessionStorage on initial render (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = sessionStorage.getItem("cart");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from session storage:", error);
        // sessionStorage.removeItem('cart'); // Optionally clear corrupted storage
      }
    }
  }, []);

  // Save cart to sessionStorage whenever it changes (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to session storage:", error);
      }
    }
  }, [cartItems]);

  const addToCart = (
    item: MenuItem,
    restaurant: Pick<Restaurant, "_id" | "name">
  ) => {
    // Ensure item.id is present
    if (!item.id) {
      console.error("Attempted to add item without ID to cart:", item);
      // Potentially show a toast to the user
      return;
    }
    // Ensure restaurant._id is present
    if (!restaurant._id) {
      console.error(
        "Attempted to add item with invalid restaurant ID:",
        restaurant
      );
      return;
    }

    setCartItems((prevItems) => {
      // Check if the new item is from a different restaurant than existing cart items
      if (
        prevItems.length > 0 &&
        prevItems[0].restaurantId !== restaurant._id
      ) {
        // Here, you could either:
        // 1. Clear the cart and add the new item (common behavior)
        // 2. Show a confirmation dialog to the user
        // 3. Disallow adding items from different restaurants (not implemented here)
        console.warn(
          "Adding item from a different restaurant. Current cart will be cleared."
        );
        // alert("You can only order from one restaurant at a time. Adding this item will clear your current cart.");
        return [
          {
            ...item,
            quantity: 1,
            restaurantId: restaurant._id as string,
            restaurantName: restaurant.name,
          },
        ];
      }

      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prevItems,
          {
            ...item,
            quantity: 1,
            restaurantId: restaurant._id as string,
            restaurantName: restaurant.name,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(0, newQuantity) }
              : item
          )
          .filter((item) => item.quantity > 0) // Remove item if quantity becomes 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
