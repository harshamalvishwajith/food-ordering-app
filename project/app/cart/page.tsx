"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/lib/session"; // Import CartItem type

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cart items");
      }
      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching cart items."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateCartItemQuantity = async (
    itemId: string,
    restaurantId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return; // Prevent negative quantities

    const itemToUpdate = cartItems.find(
      (item) => item.itemId === itemId && item.restaurantId === restaurantId
    );
    if (!itemToUpdate) return;

    const updatedItem = { ...itemToUpdate, quantity: newQuantity };

    // If quantity is 0, it implies removal, otherwise it's an update.
    const itemsToSend =
      newQuantity === 0
        ? cartItems.filter(
            (item) =>
              !(item.itemId === itemId && item.restaurantId === restaurantId)
          )
        : cartItems.map((item) =>
            item.itemId === itemId && item.restaurantId === restaurantId
              ? updatedItem
              : item
          );

    try {
      const response = await fetch("/api/cart", {
        method: "POST", // Assuming POST updates/replaces the cart or specific items
        headers: {
          "Content-Type": "application/json",
        },
        // Send only the updated item or the whole cart based on API design
        // For this example, sending the specific item to be updated/added
        // The API route needs to handle this logic to update the session correctly.
        // A more robust API might take an array of all items to set the cart state.
        body: JSON.stringify({
          items:
            newQuantity > 0
              ? [updatedItem]
              : itemsToSend.filter((i) => i.quantity > 0),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cart item");
      }
      // Refetch cart to ensure UI is in sync with server state
      // Or update local state directly if API returns the updated cart
      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      console.error("Error updating cart item:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while updating the item."
      );
      // Optionally revert optimistic update or show error to user
    }
  };

  const removeCartItem = async (itemId: string, restaurantId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, restaurantId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item from cart");
      }
      // Update local state to reflect removal
      // setCartItems((prevItems) => prevItems.filter(item => !(item.itemId === itemId && item.restaurantId === restaurantId)));
      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      console.error("Error removing cart item:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while removing the item."
      );
    }
  };

  const clearCart = async () => {
    // Determine if we need to clear for a specific restaurant or all
    // For simplicity, this example clears the whole cart.
    // You might want to pass restaurantId if your cart supports multiple restaurants distinctly.
    const restaurantId =
      cartItems.length > 0 ? cartItems[0].restaurantId : undefined;

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurantId }), // Sending restaurantId to potentially clear only that part of cart
        // If restaurantId is undefined, API should clear all.
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clear cart");
      }
      setCartItems([]); // Clear local state
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while clearing the cart."
      );
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 500 : 0; // Example delivery fee
  const total = subtotal + deliveryFee;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
        <p className="text-xl font-semibold">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-xl font-semibold text-red-600">
          Oops! Something went wrong.
        </p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchCartItems}>Try Again</Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  // Assuming all items in the cart are from the same restaurant for this page display
  // You might need to group by restaurant if your cart can hold items from multiple restaurants.
  const currentRestaurantId = cartItems[0]?.restaurantId;
  // TODO: Fetch restaurant details if needed (e.g., restaurant name) using currentRestaurantId

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {/* Optionally display restaurant name if available */}
        {/* <p className="text-muted-foreground">From: {cartItems[0]?.restaurantName || currentRestaurantId}</p> */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          disabled={cartItems.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <Card
            key={`${item.itemId}-${item.restaurantId}`}
            className="overflow-hidden flex flex-col sm:flex-row"
          >
            <div className="sm:w-32 sm:h-auto h-48 overflow-hidden relative">
              <img
                src={item.image || "/placeholder-menu-item.jpg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4 flex-grow flex flex-col justify-between sm:p-6">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                {/* <p className="text-sm text-muted-foreground">Restaurant: {item.restaurantName || item.restaurantId}</p> */}
                <p className="text-sm text-primary font-medium mt-1">
                  LKR {item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateCartItemQuantity(
                        item.itemId,
                        item.restaurantId,
                        item.quantity - 1
                      )
                    }
                    disabled={item.quantity <= 0} // Disable if 0, removal should be explicit or handled by update logic
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateCartItemQuantity(
                        item.itemId,
                        item.restaurantId,
                        item.quantity + 1
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={() => removeCartItem(item.itemId, item.restaurantId)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>LKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery Fee</span>
            <span>LKR {deliveryFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>LKR {total.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30">
          <Button size="lg" className="w-full" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
