"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, CreditCard, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue="John"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue="Doe"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue="+1 (555) 000-0000"
                    disabled={!isEditing}
                  />
                </div>
                {isEditing && (
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample order - replace with actual data */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Order #12345</h3>
                      <p className="text-sm text-muted-foreground">
                        March 15, 2024
                      </p>
                    </div>
                    <Badge variant="outline">Delivered</Badge>
                  </div>
                  <div className="space-y-2">
                    <p>Burger King - 2 items</p>
                    <p className="text-sm text-muted-foreground">
                      Total: $25.98
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Saved Addresses</CardTitle>
              <Button>Add New Address</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample address - replace with actual data */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Home</h3>
                      <p className="text-sm text-muted-foreground">
                        123 Main St, Apt 4B
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Methods</CardTitle>
              <Button>Add New Card</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample payment method - replace with actual data */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <h3 className="font-semibold">•••• •••• •••• 4242</h3>
                        <p className="text-sm text-muted-foreground">
                          Expires 12/25
                        </p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full border rounded-md p-2"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <Label>Email Notifications</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span>Order Updates</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Promotions</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Newsletter</span>
                      <Switch />
                    </div>
                  </div>
                </div>
                <Button variant="destructive" className="mt-4">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
