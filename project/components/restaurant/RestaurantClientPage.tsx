"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Star, Plus, Minus } from "lucide-react";
import { Restaurant, MenuItem } from "@/types/schema";

interface RestaurantClientPageProps {
  restaurant: Restaurant;
}

export default function RestaurantClientPage({
  restaurant,
}: RestaurantClientPageProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [errorMenu, setErrorMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurant?._id) {
      setErrorMenu("Restaurant ID is missing.");
      setIsLoadingMenu(false);
      return;
    }

    const fetchMenuItems = async () => {
      setIsLoadingMenu(true);
      setErrorMenu(null);
      try {
        console.log(
          `[RestaurantClientPage] Fetching menu for restaurantId: ${restaurant._id}`
        );
        const response = await fetch(`https://localhost:7046/api/Menu`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `[RestaurantClientPage] API request failed: ${response.status} ${response.statusText}`,
            errorText
          );
          throw new Error(
            `Failed to fetch menu items: ${response.status} ${response.statusText}. ${errorText}`
          );
        }
        const allItems: any[] = await response.json();
        console.log(
          "[RestaurantClientPage] All items fetched from API:",
          JSON.stringify(allItems, null, 2)
        );

        const restaurantItems = allItems
          .filter((item) => item.restaurantId === restaurant._id)
          .map((item) => ({
            id: item.id,
            restaurantId: item.restaurantId,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            isAvailable: item.isAvailable,
            image: item.imageUrl,
          }));

        console.log(
          `[RestaurantClientPage] Fetched ${restaurantItems.length} menu items for restaurant ${restaurant._id}`
        );
        console.log(
          "[RestaurantClientPage] Filtered restaurant items:",
          JSON.stringify(restaurantItems, null, 2)
        );
        setMenu(restaurantItems);
      } catch (error) {
        console.error(
          "Error fetching menu items in RestaurantClientPage:",
          error
        );
        setErrorMenu(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchMenuItems();
  }, [restaurant?._id]);

  const updateQuantity = (itemId: string | null, delta: number) => {
    if (itemId === null) {
      console.warn("updateQuantity called with null itemId");
      return;
    }
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }));
  };

  if (isLoadingMenu) {
    return (
      <div className="container max-w-6xl py-12 mx-auto">Loading menu...</div>
    );
  }

  if (errorMenu) {
    return (
      <div className="container max-w-6xl py-12 mx-auto">
        Error loading menu: {errorMenu}
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <img
          src={restaurant.image ?? "/placeholder-image.jpg"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {restaurant.location ?? "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {restaurant.deliveryTime
                ? `${restaurant.deliveryTime} min`
                : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {restaurant.rating ?? "N/A"}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu.length === 0 && !isLoadingMenu && !errorMenu && (
              <p>No menu items available for this restaurant.</p>
            )}
            {menu.map((item) => (
              <Card
                key={item.id ?? `item-${item.name}-${item.price}`}
                className="overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img
                    src={item.image ?? "/placeholder-menu-item.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description ?? "No description available."}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {item.category ?? "Uncategorized"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-semibold">
                      LKR {item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (item.id !== null) {
                            updateQuantity(item.id, -1);
                          }
                        }}
                        disabled={item.id === null || !quantities[item.id]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {(item.id !== null && quantities[item.id]) || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (item.id !== null) {
                            updateQuantity(item.id, 1);
                          }
                        }}
                        disabled={item.id === null}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {restaurant.phone ?? "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {restaurant.location ?? "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                {/* Replace with actual opening hours data if available */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Monday - Friday</div>
                  <div>9:00 AM - 10:00 PM</div>
                  <div>Saturday - Sunday</div>
                  <div>10:00 AM - 11:00 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Sample reviews - replace with actual data */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">John Doe</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4" /> {/* Empty star */}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      2 days ago
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Great food and fast delivery! Will order again.
                  </p>
                </div>
                {/* Add more reviews as needed */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
