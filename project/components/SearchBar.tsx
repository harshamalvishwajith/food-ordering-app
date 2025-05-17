"use client";

import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Search submitted with query:",
      value,
      "and location:",
      location
    );
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-card shadow-md rounded-lg p-2 flex flex-col sm:flex-row gap-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for food or restaurants..."
          className="pl-10 border-0 shadow-none focus-visible:ring-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Your location..."
          className="pl-10 border-0 shadow-none focus-visible:ring-0"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="sm:w-auto w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
