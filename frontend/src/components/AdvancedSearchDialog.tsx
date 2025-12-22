import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  q?: string;
  tags?: string[];
  author?: string;
  status?: 'all' | 'solved' | 'unsolved';
  sort?: 'recent' | 'votes' | 'views' | 'answers';
  minVotes?: number;
  maxVotes?: number;
  minAnswers?: number;
  maxAnswers?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function AdvancedSearchDialog({ 
  open, 
  onOpenChange, 
  onSearch,
  initialFilters = {}
}: AdvancedSearchDialogProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags?.includes(tagInput.trim())) {
      setFilters({
        ...filters,
        tags: [...(filters.tags || []), tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFilters({
      ...filters,
      tags: filters.tags?.filter(t => t !== tag)
    });
  };

  const handleSearch = () => {
    onSearch(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({});
    setTagInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              placeholder="Search in titles and content..."
              value={filters.q || ""}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tag (e.g., React, Node.js)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button type="button" onClick={handleAddTag}>Add</Button>
            </div>
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author Username</Label>
            <Input
              id="author"
              placeholder="Filter by author..."
              value={filters.author || ""}
              onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            />
          </div>

          {/* Status and Sort */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value: any) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="unsolved">Unsolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select
                value={filters.sort || 'recent'}
                onValueChange={(value: any) => setFilters({ ...filters, sort: value })}
              >
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Recent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="votes">Most Votes</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="answers">Most Answers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vote Range */}
          <div className="space-y-2">
            <Label>Vote Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min votes"
                value={filters.minVotes || ""}
                onChange={(e) => setFilters({ ...filters, minVotes: e.target.value ? Number(e.target.value) : undefined })}
              />
              <Input
                type="number"
                placeholder="Max votes"
                value={filters.maxVotes || ""}
                onChange={(e) => setFilters({ ...filters, maxVotes: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </div>

          {/* Answer Range */}
          <div className="space-y-2">
            <Label>Answer Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min answers"
                value={filters.minAnswers || ""}
                onChange={(e) => setFilters({ ...filters, minAnswers: e.target.value ? Number(e.target.value) : undefined })}
              />
              <Input
                type="number"
                placeholder="Max answers"
                value={filters.maxAnswers || ""}
                onChange={(e) => setFilters({ ...filters, maxAnswers: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date-from" className="text-xs text-muted-foreground">From</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date-to" className="text-xs text-muted-foreground">To</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
