import RestaurantClientPage from "@/components/restaurant/RestaurantClientPage";
import { notFound } from "next/navigation"; // Import notFound
import { Restaurant, MenuItem } from "@/types/schema"; // Import Restaurant and MenuItem types

// Fetch menu items from the MenuService API
async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  try {
    console.log(
      `[getMenuItems] Fetching menu for restaurantId: ${restaurantId}`
    ); // Added log
    const response = await fetch(`https://localhost:7046/api/Menu`);
    if (!response.ok) {
      console.error(
        `[getMenuItems] API request failed: ${response.status} ${response.statusText}`
      ); // Added log
      throw new Error(
        `Failed to fetch menu items: ${response.status} ${response.statusText}`
      );
    }
    const allItems: any[] = await response.json();
    console.log(
      "[getMenuItems] All items fetched from API:",
      JSON.stringify(allItems, null, 2)
    ); // Added log for all items

    // Filter items for the specific restaurant and map to the frontend MenuItem interface
    const restaurantItems = allItems
      .filter((item) => {
        const match = item.restaurantId === restaurantId;
        // console.log(`[getMenuItems] Filtering item: ID=${item.id}, item.restaurantId=${item.restaurantId}, match=${match}`); // Optional detailed log for each item
        return match;
      })
      .map((item) => ({
        id: item.id, // Assuming backend Id is serialized as id
        restaurantId: item.restaurantId,
        name: item.name,
        description: item.description, // Ensure backend provides this or handle if optional
        price: item.price,
        category: item.category, // Ensure backend provides this or handle if optional
        isAvailable: item.isAvailable,
        image: item.image, // Ensure backend provides this or handle if optional
      }));

    console.log(
      // This log was already present, good for final count
      `[getMenuItems] Fetched ${restaurantItems.length} menu items for restaurant ${restaurantId}`
    );
    console.log(
      "[getMenuItems] Filtered restaurant items:",
      JSON.stringify(restaurantItems, null, 2)
    ); // Added log for filtered items
    return restaurantItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return []; // Return empty array or handle error as appropriate
  }
}

// Function to fetch a single restaurant by ID
async function getRestaurant(id: string): Promise<Restaurant | null> {
  try {
    const response = await fetch(`http://localhost:3006/api/restaurants/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Restaurant not found
      }
      throw new Error(
        `Failed to fetch restaurant: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching restaurant ${id}:`, error);
    return null; // Return null or handle error as appropriate
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`http://localhost:3006/api/restaurants`);
    if (!response.ok) {
      console.error(
        "Failed to fetch restaurants for generateStaticParams:",
        response.status,
        response.statusText
      );
      return []; // Return empty array on error to prevent build failure, or handle differently
    }
    const allRestaurants: Restaurant[] = await response.json();
    return allRestaurants.map((restaurant) => ({
      id: restaurant._id,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export default async function RestaurantPage({
  params,
}: {
  readonly params: { id: string }; // Added readonly
}) {
  const restaurant = await getRestaurant(params.id);

  if (!restaurant?._id) {
    notFound(); // Use notFound() for a cleaner 404 handling
  }

  return <RestaurantClientPage restaurant={restaurant} />;
}
