"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Clock, DollarSign } from "lucide-react";
import { DeliveryItem, DeliveryStatus } from "@/types/schema";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const DeliveryMap = dynamic(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse rounded-lg" />
  ),
});

// Mock data for active deliveries
const activeDeliveries: DeliveryItem[] = [
  {
    id: "1",
    orderId: "ORD-001",
    riderId: "RIDER-001",
    pickupLocation: "Kottu Hut, 123 Galle Road, Colombo",
    dropoffLocation: "456 Marine Drive, Colombo",
    customerName: "Kasun Perera",
    status: DeliveryStatus.PENDING,
    createdAt: new Date().toISOString(),
    items: [
      { name: "Chicken Kottu", quantity: 1, price: "Rs. 850" },
      { name: "Iced Milo", quantity: 1, price: "Rs. 250" },
    ],
    totalAmount: "Rs. 1,100",
    pickupCoords: [6.9271, 79.8612],
    dropoffCoords: [6.9157, 79.8487],
  },
  {
    id: "2",
    orderId: "ORD-002",
    riderId: "RIDER-001",
    pickupLocation: "Paan Paan, 789 Duplication Road, Colombo",
    dropoffLocation: "321 Havelock Road, Colombo",
    customerName: "Nimali Fernando",
    status: DeliveryStatus.ASSIGNED,
    createdAt: new Date().toISOString(),
    items: [
      { name: "Cheese Toast", quantity: 2, price: "Rs. 400" },
      { name: "Coffee", quantity: 1, price: "Rs. 300" },
    ],
    totalAmount: "Rs. 1,100",
    pickupCoords: [6.8886, 79.8678],
    dropoffCoords: [6.8875, 79.8607],
  },
];

export default function ActiveDeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem>(
    activeDeliveries[0]
  );
  const [showMap, setShowMap] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = (newStatus: DeliveryStatus) => {
    // In a real application, this would make an API call
    toast({
      title: "Status Updated",
      description: `Delivery status changed to ${newStatus}`,
    });
  };

  const getStatusBadgeColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.PENDING:
        return "bg-yellow-500";
      case DeliveryStatus.ASSIGNED:
        return "bg-blue-500";
      case DeliveryStatus.PICKED_UP:
        return "bg-orange-500";
      case DeliveryStatus.DELIVERED:
        return "bg-green-500";
      case DeliveryStatus.CANCELLED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Active Deliveries</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-green-500">
            Online
          </Badge>
          <Button variant="outline">Go Offline</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {activeDeliveries.map((delivery) => (
            <Card
              key={delivery.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedDelivery.id === delivery.id ? "border-primary" : ""
              }`}
              onClick={() => {
                setSelectedDelivery(delivery);
                setShowMap(false);
              }}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{`Order #${delivery.orderId}`}</h3>
                    <p className="text-sm text-muted-foreground">
                      {delivery.customerName}
                    </p>
                  </div>
                  <Badge className={getStatusBadgeColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">
                      {delivery.dropoffLocation}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Estimated: 30 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{delivery.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            {!showMap ? (
              <>
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Pickup Location</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Restaurant</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedDelivery.pickupLocation}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowMap(true)}
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Navigate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Drop-off Location</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {selectedDelivery.customerName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedDelivery.dropoffLocation}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Order Details</h3>
                      <Card>
                        <CardContent className="p-4">
                          <ul className="space-y-2">
                            {selectedDelivery.items.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <span className="h-2 w-2 bg-primary rounded-full mr-2" />
                                  <span>{item.name}</span>
                                  <span className="text-muted-foreground ml-2">
                                    x{item.quantity}
                                  </span>
                                </div>
                                <span>{item.price}</span>
                              </li>
                            ))}
                            <li className="pt-2 border-t mt-2">
                              <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>{selectedDelivery.totalAmount}</span>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-4">
                      {selectedDelivery.status === DeliveryStatus.PENDING && (
                        <Button
                          className="flex-1"
                          onClick={() =>
                            handleStatusUpdate(DeliveryStatus.ASSIGNED)
                          }
                        >
                          Accept Delivery
                        </Button>
                      )}
                      {selectedDelivery.status === DeliveryStatus.ASSIGNED && (
                        <Button
                          className="flex-1"
                          onClick={() =>
                            handleStatusUpdate(DeliveryStatus.PICKED_UP)
                          }
                        >
                          Mark as Picked Up
                        </Button>
                      )}
                      {selectedDelivery.status === DeliveryStatus.PICKED_UP && (
                        <Button
                          className="flex-1"
                          onClick={() =>
                            handleStatusUpdate(DeliveryStatus.DELIVERED)
                          }
                        >
                          Complete Delivery
                        </Button>
                      )}
                      <Button variant="outline" className="flex-1">
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle>Navigation</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMap(false)}
                    >
                      Back to Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[600px]">
                    <DeliveryMap delivery={selectedDelivery} />
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
