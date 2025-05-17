"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/SearchBar"; // Assuming SearchBar takes value and onChange
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/sheet";

// Define the structure of your Restaurant data based on IRestaurant from backend
interface Restaurant {
  _id: string;
  name: string;
  cuisine?: string;
  location?: string;
  phone?: string;
  isOpen: boolean;
  rating?: number;
  deliveryTime?: number; // Assuming this is in minutes
  image?: string;
  freeDelivery?: boolean;
}

// Categories for filtering UI - these names should ideally match potential cuisine values
interface Category {
  id: string; // Keep id for key prop
  name: string; // This will be used to match against restaurant.cuisine
}

const staticCategories: Category[] = [
  { id: "1", name: "Italian" },
  { id: "2", name: "Chinese" },
  { id: "3", name: "Mexican" },
  { id: "4", name: "Indian" },
  { id: "5", name: "Cafe" },
  { id: "6", name: "Pizza" },
  { id: "7", name: "Burger" },
  { id: "8", name: "Sushi" },
  // Add more common cuisine types that your restaurants might have
];

const deliveryTimeOptions = [
  { id: "time-15", label: "Under 15 min", value: 15 },
  { id: "time-30", label: "Under 30 min", value: 30 },
  { id: "time-45", label: "Under 45 min", value: 45 },
];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDeliveryTimes, setSelectedDeliveryTimes] = useState<number[]>(
    []
  );

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3006/api/restaurants");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Restaurant[] = await response.json();
        setRestaurants(data);
      } catch (e: any) {
        setError(e.message || "Failed to fetch restaurants.");
        console.error("Failed to fetch restaurants:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCuisineChange = useCallback(
    (cuisineName: string, checked: boolean | "indeterminate") => {
      setSelectedCuisines((prev) =>
        checked ? [...prev, cuisineName] : prev.filter((c) => c !== cuisineName)
      );
    },
    []
  );

  const handleDeliveryTimeChange = useCallback(
    (timeValue: number, checked: boolean | "indeterminate") => {
      setSelectedDeliveryTimes((prev) =>
        checked ? [...prev, timeValue] : prev.filter((t) => t !== timeValue)
      );
    },
    []
  );

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Search filter (case-insensitive)
      if (
        searchTerm &&
        !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Cuisine filter (case-insensitive)
      if (selectedCuisines.length > 0) {
        if (
          !restaurant.cuisine ||
          !selectedCuisines.some(
            (selCuisine) =>
              restaurant.cuisine?.toLowerCase() === selCuisine.toLowerCase()
          )
        ) {
          return false;
        }
      }

      // Delivery Time filter
      if (selectedDeliveryTimes.length > 0) {
        // Restaurant must meet *at least one* of the selected time limits
        // e.g., if "Under 15 min" and "Under 30 min" are selected, show restaurants <= 30 min.
        // Or, more strictly, if "Under 15 min" is selected, only show those <= 15.
        // Current logic: if any selected time limit is met, it passes.
        // To be more precise, one might want to filter by the *minimum* selected time if that's the intent.
        // For now, we check if the restaurant's delivery time is less than or equal to ANY of the selected values.
        // A restaurant with deliveryTime=10 will pass if [15, 30] is selected.
        // A restaurant with deliveryTime=20 will pass if [15, 30] is selected (because 20 <= 30).
        // A restaurant with deliveryTime=35 will NOT pass if [15, 30] is selected.
        const meetsAnyDeliveryTime = selectedDeliveryTimes.some(
          (limit) =>
            restaurant.deliveryTime != null && restaurant.deliveryTime <= limit
        );
        if (!meetsAnyDeliveryTime) {
          return false;
        }
      }
      return true;
    });
  }, [restaurants, searchTerm, selectedCuisines, selectedDeliveryTimes]);

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-12 mx-auto text-center">
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl py-12 mx-auto text-center">
        <p>Error fetching restaurants: {error}</p>
      </div>
    );
  }

  const categoriesToDisplay = staticCategories;

  const renderFilterCheckboxes = (
    isMobile: boolean,
    categories: Category[],
    selectedCuisines: string[],
    onCuisineChange: (name: string, checked: boolean | "indeterminate") => void,
    deliveryTimes: typeof deliveryTimeOptions,
    selectedDeliveryTimes: number[],
    onDeliveryTimeChange: (
      value: number,
      checked: boolean | "indeterminate"
    ) => void
  ) => (
    <>
      {/* Categories Filter */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={
                isMobile ? `mobile-cat-${category.id}` : `cat-${category.id}`
              }
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={
                  isMobile
                    ? `mobile-category-${category.id}`
                    : `category-${category.id}`
                }
                checked={selectedCuisines.includes(category.name)}
                onCheckedChange={(checked) =>
                  onCuisineChange(category.name, checked)
                }
              />
              <Label
                htmlFor={
                  isMobile
                    ? `mobile-category-${category.id}`
                    : `category-${category.id}`
                }
                className="text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Time Filter */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="font-semibold mb-4">Delivery Time</h3>
        <div className="space-y-2">
          {deliveryTimes.map((time) => (
            <div
              key={isMobile ? `mobile-dt-${time.id}` : `dt-${time.id}`}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={isMobile ? `mobile-${time.id}` : time.id}
                checked={selectedDeliveryTimes.includes(time.value)}
                onCheckedChange={(checked) =>
                  onDeliveryTimeChange(time.value, checked)
                }
              />
              <Label
                htmlFor={isMobile ? `mobile-${time.id}` : time.id}
                className="text-sm cursor-pointer"
              >
                {time.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Restaurants Near You</h1>

      <div className="mb-8">
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="w-full lg:w-1/4 space-y-6 hidden lg:block">
          {renderFilterCheckboxes(
            false,
            categoriesToDisplay,
            selectedCuisines,
            handleCuisineChange,
            deliveryTimeOptions,
            selectedDeliveryTimes,
            handleDeliveryTimeChange
          )}
          {/* Price Range and Dietary filters are removed */}
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your restaurant search
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-4">
                {renderFilterCheckboxes(
                  true,
                  categoriesToDisplay,
                  selectedCuisines,
                  handleCuisineChange,
                  deliveryTimeOptions,
                  selectedDeliveryTimes,
                  handleDeliveryTimeChange
                )}
                {/* Price Range and Dietary filters are removed */}
              </div>
              <SheetFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    // Potentially close sheet if filters apply instantly
                    // Or if an "Apply" button is desired, manage staged filters
                  }}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Restaurant List */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="pickup">Pickup</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 text-sm text-muted-foreground">
              {/* Sorting buttons - functionality to be re-connected */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Delivery Time
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <Star className="h-3 w-3" />
                  Rating
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  Distance
                </Button>
              </div>
            </div>
          </div>

          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No restaurants match your current filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
