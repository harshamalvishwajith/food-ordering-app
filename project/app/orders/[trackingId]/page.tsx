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
  restaurantAddress: "123/2 Kandy Road, Pilimathalawa",
  restaurantPhone: "+94(777) 123-4567",
  customerName: "Kanchana Wimalasena",
  deliveryAddress: "111/A/9 Araliya Uyana Angunawala,Peradeniya",
  customerPhone: "+1 (555) 987-6543",
  status: "In Progress", // This might need adjustment based on DeliveryStatus enum if used directly
  estimatedDelivery: "30-40 min",
  items: [
    { name: "Classic Burger", quantity: 1, price: "LKR 400.00" },
    { name: "Cheese Pizza", quantity: 2, price: "LKR 2400.00" },
  ],
  total: "LKR 2800.00",
  rider: {
    name: "Mahesh Perera",
    phone: "+94 (777) 234-5678",
    photo: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
  },
  pickupCoords: [7.2663, 80.5522] as [number, number],
  dropoffCoords: [7.2699, 80.5938] as [number, number],
};

const deliverySteps = [
  { status: "Order Confirmed", completed: true, time: "3:30 PM" },
  { status: "Preparing Order", completed: true, time: "3:35 PM" },
  { status: "Rider Assigned", completed: false },
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
