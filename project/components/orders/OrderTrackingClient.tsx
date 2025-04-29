"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { DeliveryStatus } from "@/types/schema"; // Assuming DeliveryStatus is needed for DeliveryMap

// Dynamically import the Map component to avoid SSR issues
const DeliveryMap = dynamic(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse rounded-lg" />
  ),
});

// Define the structure for order details and delivery steps props
interface OrderDetails {
  id: string;
  trackingId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  customerName: string;
  deliveryAddress: string;
  customerPhone: string;
  status: string;
  estimatedDelivery: string;
  items: { name: string; quantity: number; price: string }[];
  total: string;
  rider: {
    name: string;
    phone: string;
    photo: string;
  };
  pickupCoords?: [number, number];
  dropoffCoords?: [number, number];
}

interface DeliveryStep {
  status: string;
  completed: boolean;
  time?: string;
}

interface OrderTrackingClientProps {
  orderDetails: OrderDetails;
  deliverySteps: DeliveryStep[];
}

export default function OrderTrackingClient({
  orderDetails,
  deliverySteps,
}: OrderTrackingClientProps) {
  const [showMap, setShowMap] = useState(false);

  // Simulate real-time updates (can be removed if not needed or handled differently)
  useEffect(() => {
    const interval = setInterval(() => {
      // Placeholder for potential future real-time update logic
      // console.log("Checking for updates...");
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Track Order #{orderDetails.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Delivery Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {deliverySteps.map((step, index) => (
                  <div key={index} className="flex items-start mb-8 last:mb-0">
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                        ${
                          step.completed
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {step.completed && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      {index < deliverySteps.length - 1 && (
                        <div
                          className={`absolute top-8 left-1/2 w-0.5 h-12 -translate-x-1/2
                          ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium">{step.status}</p>
                      {step.time && (
                        <p className="text-sm text-muted-foreground">
                          {step.time}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Route/Map Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Delivery Route</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showMap ? (
                <div className="h-[400px] rounded-lg overflow-hidden">
                  {/* Ensure DeliveryMap props match its definition */}
                  <DeliveryMap
                    delivery={{
                      id: orderDetails.trackingId, // Use appropriate ID
                      orderId: orderDetails.id,
                      riderId: "RIDER-MOCK", // Placeholder
                      pickupLocation: orderDetails.restaurantAddress,
                      dropoffLocation: orderDetails.deliveryAddress,
                      customerName: orderDetails.customerName,
                      status: DeliveryStatus.ASSIGNED, // Example status, adjust as needed
                      createdAt: new Date().toISOString(), // Placeholder
                      items: orderDetails.items.map((item) => ({
                        ...item,
                        price: item.price.toString(),
                      })), // Ensure price is string if needed
                      totalAmount: orderDetails.total.toString(), // Ensure total is string if needed
                      pickupCoords: orderDetails.pickupCoords,
                      dropoffCoords: orderDetails.dropoffCoords,
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      <p className="text-sm text-muted-foreground">
                        {orderDetails.restaurantAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Navigation className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Delivery Location</p>
                      <p className="text-sm text-muted-foreground">
                        {orderDetails.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Order Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Items</h3>
                  <ul className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {item.price}
                        </span>
                      </li>
                    ))}
                    <li className="flex justify-between font-semibold pt-2 border-t mt-2">
                      <span>Total</span>
                      <span>{orderDetails.total}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Partner Card */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={orderDetails.rider.photo}
                  alt={orderDetails.rider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{orderDetails.rider.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Delivery Partner
                  </p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Rider
              </Button>
            </CardContent>
          </Card>

          {/* Restaurant Card */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{orderDetails.restaurantName}</p>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.restaurantAddress}
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Restaurant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
