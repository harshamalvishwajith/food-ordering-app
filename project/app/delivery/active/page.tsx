"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Clock, DollarSign } from "lucide-react";

// Mock data for active deliveries
const activeDeliveries = [
  {
    id: "1",
    restaurant: "Burger King",
    customer: "John Doe",
    address: "123 Main St, New York",
    items: ["Classic Burger", "Fries"],
    status: "picking_up",
    earnings: 8.5,
    estimatedTime: "20 min",
    phone: "+1 (555) 000-0000",
  },
  {
    id: "2",
    restaurant: "Pizza Palace",
    customer: "Jane Smith",
    address: "456 Oak St, New York",
    items: ["Pepperoni Pizza", "Garlic Bread"],
    status: "delivering",
    earnings: 10.25,
    estimatedTime: "15 min",
    phone: "+1 (555) 111-1111",
  },
];

export default function ActiveDeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState(activeDeliveries[0]);

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
              onClick={() => setSelectedDelivery(delivery)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{delivery.restaurant}</h3>
                    <p className="text-sm text-muted-foreground">
                      {delivery.customer}
                    </p>
                  </div>
                  <Badge
                    className={
                      delivery.status === "picking_up"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }
                  >
                    {delivery.status === "picking_up"
                      ? "Picking Up"
                      : "Delivering"}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{delivery.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{delivery.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${delivery.earnings.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Restaurant</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {selectedDelivery.restaurant}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            123 Restaurant St
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Customer</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {selectedDelivery.customer}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedDelivery.address}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <Navigation className="h-4 w-4 mr-2" />
                            Navigate
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        </div>
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
                          <li key={index} className="flex items-center">
                            <span className="h-2 w-2 bg-primary rounded-full mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4">
                  {selectedDelivery.status === "picking_up" ? (
                    <Button className="flex-1">Mark as Picked Up</Button>
                  ) : (
                    <Button className="flex-1">Complete Delivery</Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    Report Issue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
