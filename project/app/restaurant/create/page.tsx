"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Clock, UtensilsCrossed } from "lucide-react";

// Interface for the restaurant data to be sent to the API
// Based on restaurant-service/src/models/restaurant.model.ts
interface CreateRestaurantPayload {
  name: string;
  cuisine?: string;
  location?: string;
  phone?: string;
  image?: string;
  // isOpen, rating, deliveryTime, freeDelivery have defaults in the backend model
}

export default function CreateRestaurantPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const cuisine = formData.get("cuisine") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const zipCode = formData.get("zipCode") as string;
    const phone = formData.get("phone") as string;
    const image = formData.get("image") as string;

    const payload = {
      name,
      cuisine,
      location: `${address}, ${city}, ${zipCode}`,
      phone,
      image,
    };

    try {
      const response = await fetch("http://localhost:3006/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If parsing JSON fails, use the status text
          throw new Error(
            response.statusText || `HTTP error! status: ${response.status}`
          );
        }
        throw new Error(
          errorData.message ??
            errorData.error ??
            `HTTP error! status: ${response.status}`
        );
      }

      // const result = await response.json(); // Contains the created restaurant data

      toast({
        title: "Restaurant created successfully",
        description: "Your restaurant profile has been created.",
      });

      router.push("/restaurant/dashboard");
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast({
        title: "Error creating restaurant",
        description:
          (error as Error).message ||
          "There was a problem creating your restaurant profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-12 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Restaurant</h1>
        <p className="text-muted-foreground">
          Fill in the details below to set up your restaurant profile on
          FoodHub.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Italian Bistro"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell customers about your restaurant..."
                required
              />
            </div>
            <div>
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Input
                id="cuisine"
                name="cuisine"
                placeholder="e.g., Italian, Mexican, Chinese"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Restaurant Street"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="New York" required />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="10001"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="restaurant@example.com"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours section removed as it's not in the core Restaurant model for API */}
        {/* <Card className="mb-6">
          <CardHeader> ... </CardHeader>
          <CardContent> ... </CardContent>
        </Card> */}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Restaurant Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/restaurant-image.jpg"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading} className="w-full mt-6">
          {isLoading ? "Creating..." : "Create Restaurant"}
        </Button>
      </form>
    </div>
  );
}
