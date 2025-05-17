import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, MapPin } from "lucide-react";
import Link from "next/link";
import { Restaurant } from "@/types/schema";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {restaurant.isOpen ? (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
              Open
            </Badge>
          ) : (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              Closed
            </Badge>
          )}
          {restaurant.freeDelivery && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
              Free Delivery
            </Badge>
          )}
        </div>
        <CardContent className="pt-4 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl mb-1">{restaurant.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-2">
            {restaurant.cuisine}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{restaurant.location}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{restaurant.deliveryTime} min</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
