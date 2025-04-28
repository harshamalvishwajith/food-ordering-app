import React from 'react';
import { restaurants, categories } from '@/lib/data';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchBar from '@/components/SearchBar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetHeader, SheetFooter } from '@/components/ui/sheet';

export default function RestaurantsPage() {
  return (
    <div className="container max-w-6xl py-12">
      <h1 className="text-3xl font-bold mb-8">Restaurants Near You</h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="w-full lg:w-1/4 space-y-6 hidden lg:block">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category.id}`} />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Price Range</h3>
            <Slider defaultValue={[50]} max={100} step={1} className="my-6" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$</span>
              <span>$$</span>
              <span>$$$</span>
              <span>$$$$</span>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Delivery Time</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="time-15" />
                <Label
                  htmlFor="time-15"
                  className="text-sm cursor-pointer"
                >
                  Under 15 min
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="time-30" />
                <Label
                  htmlFor="time-30"
                  className="text-sm cursor-pointer"
                >
                  Under 30 min
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="time-45" />
                <Label
                  htmlFor="time-45"
                  className="text-sm cursor-pointer"
                >
                  Under 45 min
                </Label>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Dietary</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="vegetarian" />
                <Label
                  htmlFor="vegetarian"
                  className="text-sm cursor-pointer"
                >
                  Vegetarian
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="vegan" />
                <Label
                  htmlFor="vegan"
                  className="text-sm cursor-pointer"
                >
                  Vegan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="gluten-free" />
                <Label
                  htmlFor="gluten-free"
                  className="text-sm cursor-pointer"
                >
                  Gluten Free
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Filters */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your restaurant search
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-category-${category.id}`} />
                        <Label
                          htmlFor={`mobile-category-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <Slider defaultValue={[50]} max={100} step={1} className="my-6" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$</span>
                    <span>$$</span>
                    <span>$$$</span>
                    <span>$$$$</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Delivery Time</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-time-15" />
                      <Label
                        htmlFor="mobile-time-15"
                        className="text-sm cursor-pointer"
                      >
                        Under 15 min
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-time-30" />
                      <Label
                        htmlFor="mobile-time-30"
                        className="text-sm cursor-pointer"
                      >
                        Under 30 min
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-time-45" />
                      <Label
                        htmlFor="mobile-time-45"
                        className="text-sm cursor-pointer"
                      >
                        Under 45 min
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Dietary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-vegetarian" />
                      <Label
                        htmlFor="mobile-vegetarian"
                        className="text-sm cursor-pointer"
                      >
                        Vegetarian
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-vegan" />
                      <Label
                        htmlFor="mobile-vegan"
                        className="text-sm cursor-pointer"
                      >
                        Vegan
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mobile-gluten-free" />
                      <Label
                        htmlFor="mobile-gluten-free"
                        className="text-sm cursor-pointer"
                      >
                        Gluten Free
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <SheetFooter>
                <Button className="w-full">Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Restaurant List */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="pickup">Pickup</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Delivery Time
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <Star className="h-3 w-3" />
                  Rating
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  Distance
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}