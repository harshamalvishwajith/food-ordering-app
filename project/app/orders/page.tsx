"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual API calls
const orders = [
  {
    id: "ORD-001",
    restaurantName: "Burger King",
    items: [
      { name: "Classic Burger", quantity: 1, price: "$8.99" },
      { name: "Fries", quantity: 1, price: "$3.99" },
    ],
    total: "$12.98",
    status: "In Progress",
    deliveryTime: "30-40 min",
    address: "123 Main St, New York",
    orderDate: "2024-03-20T15:30:00",
    trackingId: "TRK-001",
  },
  {
    id: "ORD-002",
    restaurantName: "Pizza Palace",
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: "$15.99" },
      { name: "Garlic Knots", quantity: 1, price: "$4.99" },
    ],
    total: "$20.98",
    status: "Delivered",
    deliveryTime: "Delivered at 2:30 PM",
    address: "456 Park Ave, New York",
    orderDate: "2024-03-19T14:00:00",
    trackingId: "TRK-002",
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const activeOrders = orders.filter((order) => order.status !== "Delivered");
  const pastOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="flex gap-4 mb-8">
        <Button
          variant={activeTab === "active" ? "default" : "outline"}
          onClick={() => setActiveTab("active")}
        >
          Active Orders
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
        >
          Order History
        </Button>
      </div>

      <div className="space-y-6">
        {(activeTab === "active" ? activeOrders : pastOrders).map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order ID: {order.id}
                  </p>
                  <CardTitle className="mt-1">{order.restaurantName}</CardTitle>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
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
                      <span>{order.total}</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Details</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {order.address}
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {order.deliveryTime}
                      </p>
                    </div>
                  </div>
                  {order.status !== "Delivered" && (
                    <Button className="w-full" asChild>
                      <Link href={`/orders/${order.trackingId}`}>
                        Track Order
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {((activeTab === "active" && activeOrders.length === 0) ||
          (activeTab === "past" && pastOrders.length === 0)) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                {activeTab === "active"
                  ? "You don't have any active orders"
                  : "You haven't placed any orders yet"}
              </p>
              <Button asChild>
                <Link href="/restaurants">Browse Restaurants</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
