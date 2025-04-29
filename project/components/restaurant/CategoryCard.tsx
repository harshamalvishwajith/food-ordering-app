"use client";

import { Card } from '@/components/ui/card';
import { Category } from '@/types/schema';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/restaurants?category=${encodeURIComponent(category.name.toLowerCase())}`);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all group"
      onClick={handleClick}
    >
      <div className="aspect-square relative bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-colors" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-medium text-sm">{category.name}</h3>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;