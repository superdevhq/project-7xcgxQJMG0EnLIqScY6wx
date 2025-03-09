
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const FilterBar = ({ onSortChange, onFilterChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Results</h2>
        <Button variant="ghost" size="sm">
          Refresh
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:justify-end">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter results..."
            className="pl-8"
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </div>
        <Select defaultValue="new" onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Newest First</SelectItem>
            <SelectItem value="old">Oldest First</SelectItem>
            <SelectItem value="upvotes">Most Upvotes</SelectItem>
            <SelectItem value="comments">Most Comments</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
