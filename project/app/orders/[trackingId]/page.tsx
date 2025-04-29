import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Navigation } from "lucide-react";
import { DeliveryStatus } from "@/types/schema";
import OrderTrackingClient from "@/components/orders/OrderTrackingClient"; // Import the client component

// Mock data - replace with actual API integration
const orderDetails = {
  id: "ORD-001",
  trackingId: "TRK-001",
  restaurantName: "Burger King",
  restaurantAddress: "123 Restaurant St, New York",
  restaurantPhone: "+1 (555) 123-4567",
  customerName: "John Doe",
  deliveryAddress: "456 Customer Ave, New York",
  customerPhone: "+1 (555) 987-6543",
  status: "In Progress", // This might need adjustment based on DeliveryStatus enum if used directly
  estimatedDelivery: "30-40 min",
  items: [
    { name: "Classic Burger", quantity: 1, price: "$8.99" },
    { name: "Fries", quantity: 1, price: "$3.99" },
  ],
  total: "$12.98",
  rider: {
    name: "Mike Wilson",
    phone: "+1 (555) 234-5678",
    photo: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
  },
  pickupCoords: [40.7128, -74.006] as [number, number],
  dropoffCoords: [40.758, -73.9855] as [number, number],
};

const deliverySteps = [
  { status: "Order Confirmed", completed: true, time: "3:30 PM" },
  { status: "Preparing Order", completed: true, time: "3:35 PM" },
  { status: "Rider Assigned", completed: true, time: "3:45 PM" },
  { status: "Order Picked Up", completed: false },
  { status: "Delivered", completed: false },
];

// Function to generate static paths
export async function generateStaticParams() {
  // In a real app, fetch possible tracking IDs here
  // For now, using the mock data's ID
  // Ensure orderDetails is accessible here or fetch IDs separately
  // For simplicity, assuming TRK-001 is the only static path needed
  return [{ trackingId: "TRK-001" }];
}

// Define the props type based on your data structure
// You might need to create a more specific type in schema.ts
type OrderDetailsType = typeof orderDetails;
type DeliveryStepType = (typeof deliverySteps)[0];

export default function OrderTrackingPage({
  params,
}: {
  params: { trackingId: string };
}) {
  // In a real app, fetch orderDetails and deliverySteps based on params.trackingId
  // For now, we use the mock data defined above

  // Pass the fetched/mock data to the client component
  return (
    <OrderTrackingClient
      orderDetails={orderDetails}
      deliverySteps={deliverySteps}
    />
  );
}
