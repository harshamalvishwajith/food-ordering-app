import { restaurants } from "@/lib/data";
import RestaurantClientPage from "@/components/restaurant/RestaurantClientPage";

export async function generateStaticParams() {
  return restaurants.map((restaurant) => ({
    id: restaurant.id,
  }));
}

// Define a type for menu items if not already defined globally
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Fetch or define menu items for the restaurant (replace with actual data fetching)
async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  // Simulate fetching menu items based on restaurant ID
  // In a real app, you would fetch this from your backend/API
  console.log(`Fetching menu items for restaurant ${restaurantId}`); // Added log
  return [
    {
      id: "1",
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, and special sauce",
      price: 12.99,
      category: "Burgers",
      image:
        "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    },
    {
      id: "2",
      name: "Cheese Pizza",
      description: "Mozzarella cheese, tomato sauce, fresh basil",
      price: 14.99,
      category: "Pizza",
      image:
        "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg",
    },
    // Add more menu items as needed based on the restaurant ID
  ];
}

export default async function RestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const restaurant = restaurants.find((r) => r.id === params.id);

  if (!restaurant) {
    // Optionally, you could return a 404 page here using notFound() from next/navigation
    return (
      <div className="container max-w-6xl py-12">Restaurant not found</div>
    );
  }

  // Fetch menu items for the specific restaurant
  const menuItems = await getMenuItems(restaurant.id);

  return <RestaurantClientPage restaurant={restaurant} menuItems={menuItems} />;
}
