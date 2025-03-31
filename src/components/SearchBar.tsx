
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md flex space-x-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="pr-10 w-full"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Search
          </>
        )}
      </Button>
    </form>
  );
};

export default SearchBar;
