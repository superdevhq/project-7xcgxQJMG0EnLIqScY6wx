
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SearchForm from "@/components/features/reddit/SearchForm";
import ResultsGrid from "@/components/features/reddit/ResultsGrid";
import FilterBar from "@/components/features/reddit/FilterBar";
import { RedditPost } from "@/components/features/reddit/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<RedditPost[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (keywords: string[], subreddits: string[]) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Call the Supabase Edge Function that uses Apify
      const { data, error } = await supabase.functions.invoke('apify-reddit', {
        body: { keywords, subreddits, limit: 25 }
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.posts && data.posts.length > 0) {
        setPosts(data.posts);
        setFilteredPosts(data.posts);
        
        toast({
          title: "Search completed",
          description: `Found ${data.posts.length} posts matching your criteria`,
        });
      } else {
        setPosts([]);
        setFilteredPosts([]);
        
        toast({
          title: "No results found",
          description: "Try different keywords or subreddits",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching Reddit:", error);
      
      toast({
        title: "Error searching Reddit",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    const sorted = [...filteredPosts];
    
    switch (value) {
      case "new":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "old":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "upvotes":
        sorted.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case "comments":
        sorted.sort((a, b) => b.commentCount - a.commentCount);
        break;
    }
    
    setFilteredPosts(sorted);
  };

  const handleFilterChange = (value: string) => {
    if (!value.trim()) {
      setFilteredPosts(posts);
      return;
    }
    
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(value.toLowerCase()) ||
        post.selftext?.toLowerCase().includes(value.toLowerCase()) ||
        post.author.toLowerCase().includes(value.toLowerCase()) ||
        post.subreddit.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredPosts(filtered);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">Reddit Scraper Dashboard</h1>
        
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="saved">Saved Searches</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[350px_1fr]">
              <div>
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              </div>
              
              <div className="space-y-4">
                {hasSearched && (
                  <>
                    <FilterBar 
                      onSortChange={handleSortChange} 
                      onFilterChange={handleFilterChange} 
                    />
                    <ResultsGrid posts={filteredPosts} isLoading={isLoading} />
                  </>
                )}
                
                {!hasSearched && (
                  <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                    <h3 className="text-lg font-medium">No search results yet</h3>
                    <p className="text-muted-foreground">
                      Enter keywords and subreddits to start searching
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <h3 className="text-lg font-medium">Saved Searches</h3>
              <p className="text-muted-foreground">
                This feature will be available after Supabase integration
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <h3 className="text-lg font-medium">Settings</h3>
              <p className="text-muted-foreground">
                Configure your scraper settings and API keys
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Index;
