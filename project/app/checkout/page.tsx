"use client";

// Add a TypeScript declaration for the payhere property on window
declare global {
  interface Window {
    payhere: any;
  }
}

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Wallet } from "lucide-react";

interface DeliveryData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  // Handle input changes for delivery data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    // Dynamically load PayHere script
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submit button clicked");
    e.preventDefault();

    //get the delivery data from the form
    // Use React state for form data instead of FormData
    if (
      !deliveryData.firstName ||
      !deliveryData.lastName ||
      !deliveryData.address ||
      !deliveryData.city ||
      !deliveryData.zipCode ||
      !deliveryData.phone
    ) {
      toast({
        title: "Please fill in all delivery details.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a random order ID
      const randomOrderId = `FDA_${Math.floor(Math.random() * 1e6)
        .toString()
        .padStart(6, "0")}`;

      const req = {
        amount: 1000,
        fname: deliveryData.firstName,
        lname: deliveryData.lastName,
        email: "kanch.prabath@gmail.com",
        phone: deliveryData.phone,
        address: deliveryData.address,
        orderId: randomOrderId,
        items: "roomA",
        currency: "LKR",
        city: "Kandy",
        country: "Sri Lanka",
      };

      let res = await axios.post("http://localhost:3020/api/checkout", req);

      console.log("Response data", res.data);
      //now the actual dial to the api happens here
      const payment = res.data;

      window.payhere.startPayment(payment);
    } catch (error) {
      console.error(error);
    }
  };

  // Redirect to order confirmation
  // router.push("/orders");

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <form
              onSubmit={handleSubmit}
              className="space-y-0"
              autoComplete="off"
              id="delivery-form"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Saman"
                        required
                        value={deliveryData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Silva"
                        required
                        value={deliveryData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main St"
                      required
                      value={deliveryData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Kandy"
                        required
                        value={deliveryData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="20400"
                        required
                        value={deliveryData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+94 (777) 000-0000"
                      required
                      value={deliveryData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>LKR 2800.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>LKR 120.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>LKR 140.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>LKR 3060.00</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={handleSubmit}
              >
                PayHere Pay
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
