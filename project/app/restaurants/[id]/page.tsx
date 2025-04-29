"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, Star, Plus, Minus } from 'lucide-react';
import { restaurants } from '@/lib/data';

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = restaurants.find(r => r.id === params.id);
  const [activeTab, setActiveTab] = useState('menu');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  if (!restaurant) {
    return <div className="container max-w-6xl py-12">Restaurant not found</div>;
  }

  const menuItems = [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, and special sauce',
      price: 12.99,
      category: 'Burgers',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'
    },
    {
      id: '2',
      name: 'Cheese Pizza',
      description: 'Mozzarella cheese, tomato sauce, fresh basil',
      price: 14.99,
      category: 'Pizza',
      image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg'
    },
    // Add more menu items as needed
  ];

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }));
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {restaurant.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {restaurant.deliveryTime} min
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {restaurant.rating}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-semibold">${item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={!quantities[item.id]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{quantities[item.id] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {restaurant.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {restaurant.location}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Monday - Friday</div>
                  <div>9:00 AM - 10:00 PM</div>
                  <div>Saturday - Sunday</div>
                  <div>10:00 AM - 11:00 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Sample reviews - replace with actual data */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">John Doe</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-muted-foreground">Great food and fast delivery! Will order again.</p>
                </div>
                {/* Add more reviews as needed */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}