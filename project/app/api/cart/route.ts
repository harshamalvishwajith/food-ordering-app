import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers"; // Import cookies

export const dynamic = "force-dynamic";

interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string;
}

interface RequestBody {
  items: CartItem[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      cookies(), // Use cookies()
      sessionOptions
    );
    const body = (await request.json()) as RequestBody;

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { message: "Invalid cart items provided." },
        { status: 400 }
      );
    }

    // Initialize cart if it doesn't exist or is not an array
    if (!session.cart || !Array.isArray(session.cart)) {
      session.cart = [];
    }

    // Logic to add/update items in the cart
    // For simplicity, this example replaces the cart with new items.
    // You might want to merge, update quantities, etc., based on your needs.
    // Ensure restaurantId is consistent or handle multiple restaurants if needed.

    const newCartItems = body.items.map((item) => ({
      ...item,
      // Ensure all necessary fields are present
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || "/placeholder-menu-item.jpg", // Default image if not provided
      restaurantId: item.restaurantId,
    }));

    // Basic logic: if items from the same restaurant, add/update.
    // If items are from a different restaurant, ask user or replace.
    // For this example, we'll assume items are for one order or replace if restaurant changes.

    if (session.cart.length > 0 && newCartItems.length > 0) {
      const currentRestaurantId = session.cart[0].restaurantId;
      const newRestaurantId = newCartItems[0].restaurantId;

      if (currentRestaurantId !== newRestaurantId) {
        // If items are from a different restaurant, clear the cart and add new items.
        // You might want to prompt the user in a real application.
        session.cart = newCartItems;
      } else {
        // Merge items if from the same restaurant
        newCartItems.forEach((newItem) => {
          const existingItemIndex = session.cart!.findIndex(
            (cartItem) => cartItem.itemId === newItem.itemId
          );
          if (existingItemIndex > -1) {
            session.cart![existingItemIndex].quantity = newItem.quantity; // Update quantity
            // If quantity is 0, it should have been filtered out before sending to API
          } else {
            session.cart!.push(newItem);
          }
        });
        // Remove items that might have been set to 0 quantity on the client but still sent
        session.cart = session.cart.filter((item) => item.quantity > 0);
      }
    } else {
      // If cart is empty, just add the new items
      session.cart = newCartItems.filter((item) => item.quantity > 0);
    }

    await session.save();

    return NextResponse.json(
      { message: "Cart updated successfully", cart: session.cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API/CART POST] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      cookies(), // Use cookies()
      sessionOptions
    );

    const cartItems = session.cart || [];
    let subtotal = 0;
    let restaurantId = undefined;
    let restaurantName = undefined; // You might need to fetch/store this

    if (cartItems.length > 0) {
      restaurantId = cartItems[0].restaurantId;
      // Assuming restaurantName might be stored or could be fetched based on ID
      // For now, let's leave it undefined or you can add logic to retrieve it.
      // restaurantName = cartItems[0].restaurantName;

      subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    const deliveryFee = cartItems.length > 0 ? 120 : 0; // Example delivery fee
    const total = subtotal + deliveryFee;

    return NextResponse.json(
      {
        cart: cartItems,
        subtotal,
        deliveryFee,
        total,
        restaurantId, // Include restaurantId
        restaurantName, // Include restaurantName (if available)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API/CART GET] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      cookies(), // Use cookies()
      sessionOptions
    );
    const { itemId, restaurantId } = await request.json();

    if (!session.cart || !Array.isArray(session.cart)) {
      return NextResponse.json(
        { message: "Cart is already empty or not initialized." },
        { status: 200 }
      );
    }

    if (itemId && restaurantId) {
      // Remove a specific item
      session.cart = session.cart.filter(
        (item) =>
          !(item.itemId === itemId && item.restaurantId === restaurantId)
      );
    } else if (restaurantId) {
      // Clear cart for a specific restaurant (or the whole cart if only one restaurant's items are there)
      session.cart = session.cart.filter(
        (item) => item.restaurantId !== restaurantId
      );
    } else {
      // Clear the entire cart if no specific item or restaurant is given
      session.cart = [];
    }

    await session.save();
    return NextResponse.json(
      { message: "Cart updated.", cart: session.cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API/CART DELETE] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
