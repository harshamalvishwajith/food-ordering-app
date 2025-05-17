"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { set } from "date-fns";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const pathname = usePathname();
  const userRole = "restaurant"; // This should be dynamically set based on the logged-in user

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Restaurants", href: "/restaurants" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Role-specific links
  const roleLinks = {
    customer: [
      { name: "My Orders", href: "/customer/orders" },
      { name: "Favorites", href: "/customer/favorites" },
      { name: "Profile", href: "/customer/profile" },
    ],
    restaurant: [
      { name: "Dashboard", href: "/restaurant/dashboard" },
      { name: "Menu", href: "/restaurant/menu" },
      { name: "Orders", href: "/restaurant/orders" },
    ],
    delivery: [
      { name: "Active Deliveries", href: "/delivery/active" },
      { name: "Earnings", href: "/delivery/earnings" },
    ],
    admin: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Users", href: "/admin/users" },
      { name: "Restaurants", href: "/admin/restaurants" },
    ],
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
              FoodHub
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>

              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 border-b px-4 py-2">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">
                        john@example.com
                      </p>
                    </div>
                    <div className="py-1">
                      {roleLinks[userRole].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 text-sm hover:bg-accent"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    <div className="py-1 border-t">
                      <button className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-accent">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          <button
            className="block md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background pt-16 md:hidden">
          <nav className="container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium py-2 border-b"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <div className="py-2 mt-4">
                  <h3 className="font-semibold text-muted-foreground mb-2">
                    Account
                  </h3>
                  {roleLinks[userRole].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-2 text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <button
                  className="flex items-center text-red-500 py-2 mt-4"
                  onClick={() => setIsAuthenticated(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
