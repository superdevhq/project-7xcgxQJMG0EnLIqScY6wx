
import React from "react";
import PostCard, { RedditPost } from "./PostCard";

interface ResultsGridProps {
  posts: RedditPost[];
  isLoading: boolean;
}

const ResultsGrid = ({ posts, isLoading }: ResultsGridProps) => {
  if (isLoading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-lg bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mt-8 flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <h3 className="text-lg font-medium">No posts found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or subreddits
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ResultsGrid;
