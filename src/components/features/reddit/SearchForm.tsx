
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RedditPost } from "./PostCard";

interface SearchFormProps {
  onSearch: (keywords: string[], subreddits: string[]) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [keyword, setKeyword] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [subreddits, setSubreddits] = useState<string[]>([]);

  const addKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()]);
      setKeyword("");
    }
  };

  const addSubreddit = () => {
    if (subreddit.trim() && !subreddits.includes(subreddit.trim())) {
      setSubreddits([...subreddits, subreddit.trim()]);
      setSubreddit("");
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const removeSubreddit = (index: number) => {
    setSubreddits(subreddits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (keywords.length === 0 && subreddits.length === 0) {
      return;
    }
    
    onSearch(keywords, subreddits);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Reddit Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">Keywords</Label>
              <div className="flex gap-2">
                <Input
                  id="keyword"
                  placeholder="Enter keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} variant="secondary">
                  Add
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {keywords.map((kw, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {kw}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeKeyword(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="subreddit">Subreddits</Label>
              <div className="flex gap-2">
                <Input
                  id="subreddit"
                  placeholder="Enter subreddit..."
                  value={subreddit}
                  onChange={(e) => setSubreddit(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubreddit())}
                />
                <Button type="button" onClick={addSubreddit} variant="secondary">
                  Add
                </Button>
              </div>
              {subreddits.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {subreddits.map((sub, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      r/{sub}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSubreddit(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isLoading || (keywords.length === 0 && subreddits.length === 0)}
          className="w-full"
        >
          {isLoading ? "Searching..." : "Search Reddit"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SearchForm;
