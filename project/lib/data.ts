import { Restaurant, Category } from "@/types/schema";

// Sample data for development and testing
export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Burger King",
    cuisine: "Fast Food",
    location: "123/2 Kandy Road, Pilimathalawa",
    phone: "555-123-4567",
    isOpen: true,
    rating: 4.2,
    deliveryTime: 25,
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    freeDelivery: true,
  },
  {
    id: "2",
    name: "Pizza Palace",
    cuisine: "Italian",
    location: "125/2 New Kandy Road, Malabe",
    phone: "555-987-6543",
    isOpen: true,
    rating: 4.7,
    deliveryTime: 30,
    image:
      "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    freeDelivery: false,
  },
  {
    id: "3",
    name: "Sushi Express",
    cuisine: "Japanese",
    location: "322, Awissawella Road, Kaduwela",
    phone: "555-456-7890",
    isOpen: true,
    rating: 4.5,
    deliveryTime: 35,
    image:
      "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    freeDelivery: false,
  },
  {
    id: "4",
    name: "Taco Bell",
    cuisine: "Mexican",
    location: "321 Hortan Place, Colombo 07",
    phone: "555-321-7890",
    isOpen: false,
    rating: 4.0,
    deliveryTime: 20,
    image:
      "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    freeDelivery: true,
  },
  {
    id: "5",
    name: "Pasta Paradise",
    cuisine: "Italian",
    location: "654 Maple St, Colombo 08",
    phone: "555-654-3210",
    isOpen: true,
    rating: 4.8,
    deliveryTime: 40,
    image:
      "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    freeDelivery: false,
  },
  {
    id: "6",
    name: "China Town",
    cuisine: "Chinese",
    location: "122/4 Nawinna Road, Colombo 09",
    phone: "555-987-1234",
    isOpen: true,
    rating: 4.3,
    deliveryTime: 30,
    image:
      "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    freeDelivery: true,
  },
];

export const categories: Category[] = [
  {
    id: "1",
    name: "Pizza",
    image:
      "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "2",
    name: "Burgers",
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "3",
    name: "Sushi",
    image:
      "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "4",
    name: "Mexican",
    image:
      "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "5",
    name: "Italian",
    image:
      "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "6",
    name: "Chinese",
    image:
      "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "7",
    name: "Indian",
    image:
      "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "8",
    name: "Desserts",
    image:
      "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];
