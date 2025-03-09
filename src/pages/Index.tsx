
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SearchForm from "@/components/features/reddit/SearchForm";
import ResultsGrid from "@/components/features/reddit/ResultsGrid";
import FilterBar from "@/components/features/reddit/FilterBar";
import { RedditPost } from "@/components/features/reddit/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Mock data for initial development
const MOCK_POSTS: RedditPost[] = [
  {
    id: "1",
    title: "What's your favorite programming language and why?",
    author: "coder123",
    subreddit: "programming",
    upvotes: 342,
    commentCount: 128,
    createdAt: new Date().toISOString(),
    url: "https://reddit.com",
    selftext: "I've been learning programming for a while now and I'm curious what languages people prefer and why. I've tried Python and JavaScript so far.",
  },
  {
    id: "2",
    title: "Just finished my first web app! Looking for feedback",
    author: "webdev_newbie",
    subreddit: "webdev",
    upvotes: 89,
    commentCount: 32,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    url: "https://reddit.com",
    thumbnail: "https://picsum.photos/seed/picsum/400/300",
    selftext: "After 3 months of learning, I finally completed my first project - a todo app with authentication and cloud storage!",
  },
  {
    id: "3",
    title: "The future of AI in software development",
    author: "ai_enthusiast",
    subreddit: "artificial",
    upvotes: 567,
    commentCount: 231,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    url: "https://reddit.com",
    thumbnail: "https://picsum.photos/seed/ai/400/300",
    selftext: "With tools like GitHub Copilot and ChatGPT, how do you think AI will change software development in the next 5 years?",
  },
  {
    id: "4",
    title: "Best resources for learning React in 2023?",
    author: "react_learner",
    subreddit: "reactjs",
    upvotes: 421,
    commentCount: 87,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    url: "https://reddit.com",
    selftext: "I'm looking to learn React properly. What courses, books, or tutorials would you recommend for someone with JavaScript experience?",
  },
  {
    id: "5",
    title: "Show Reddit: I built a tool that helps you visualize algorithms",
    author: "algo_visualizer",
    subreddit: "compsci",
    upvotes: 1024,
    commentCount: 156,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    url: "https://reddit.com",
    thumbnail: "https://picsum.photos/seed/algo/400/300",
    selftext: "I created a web app that lets you visualize sorting algorithms, pathfinding algorithms, and more. It's open source and I'd love your feedback!",
  },
  {
    id: "6",
    title: "How to prepare for technical interviews at FAANG companies",
    author: "interview_prep",
    subreddit: "cscareerquestions",
    upvotes: 876,
    commentCount: 324,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    url: "https://reddit.com",
    selftext: "I recently went through the interview process at several big tech companies. Here's what worked for me and what I wish I knew beforehand.",
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<RedditPost[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (keywords: string[], subreddits: string[]) => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would be an API call to your backend
      // For now, we'll just use mock data
      const results = MOCK_POSTS;
      setPosts(results);
      setFilteredPosts(results);
      setIsLoading(false);
      
      toast({
        title: "Search completed",
        description: `Found ${results.length} posts matching your criteria`,
      });
    }, 1500);
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
                <SearchForm onSearch={handleSearch} />
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
