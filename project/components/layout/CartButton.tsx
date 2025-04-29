import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartButton() {
  // This would be replaced with actual cart state management
  const itemCount = 3;

  return (
    <Link href="/cart" className="fixed bottom-6 right-6 z-50 ">
      <Button
        size="lg"
        className="rounded-full h-14 w-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6 text-white" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-sm font-bold text-red-500 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
      </Button>
    </Link>
  );
}
