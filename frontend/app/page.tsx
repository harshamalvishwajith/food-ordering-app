import { Button } from '@/components/ui/button';
import { ArrowRight, Search, UtensilsCrossed, Timer, MapPin } from 'lucide-react';
import Link from 'next/link';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import CategoryCard from '@/components/restaurant/CategoryCard';
import { restaurants, categories } from '@/lib/data';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 dark:from-orange-950 dark:to-red-950 -z-10" />
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                <span className="text-foreground">Delicious food delivered to your </span>
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">doorstep</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Order food from the best local restaurants with easy, contactless delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/restaurants">
                    Browse Restaurants <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative h-96">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center rounded-2xl shadow-xl" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent rounded-b-2xl" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Find your favorite food</h2>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/50 hover:shadow-md transition-all">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-500 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find restaurants</h3>
              <p className="text-muted-foreground">
                Browse restaurants and cuisines near you
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/50 hover:shadow-md transition-all">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mb-4">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose your meal</h3>
              <p className="text-muted-foreground">
                Select from a variety of delicious meals
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border/50 hover:shadow-md transition-all">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-500 mb-4">
                <Timer className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast delivery</h3>
              <p className="text-muted-foreground">
                Get your food delivered quickly to your door
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Categories</h2>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Restaurants</h2>
            <Button variant="ghost" asChild>
              <Link href="/restaurants">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border/50 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Become a delivery driver</h2>
                <p className="text-muted-foreground mb-6">
                  Make money on your schedule. Deliver with FoodHub and earn extra income whenever it works for you.
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" asChild>
                  <Link href="/delivery/register">
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="hidden md:block relative h-64">
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center rounded-xl shadow-xl" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-card/80 to-transparent rounded-b-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}