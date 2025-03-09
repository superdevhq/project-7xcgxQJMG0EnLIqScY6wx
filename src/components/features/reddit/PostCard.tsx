
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpFromLine, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  upvotes: number;
  commentCount: number;
  createdAt: string;
  url: string;
  thumbnail?: string;
  selftext?: string;
}

interface PostCardProps {
  post: RedditPost;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-medium">{post.title}</h3>
          <Badge variant="outline" className="shrink-0">
            r/{post.subreddit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          {post.thumbnail && post.thumbnail !== "self" && post.thumbnail !== "default" && (
            <div className="overflow-hidden rounded-md">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="h-40 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.selftext || "No description available"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Posted by u/{post.author}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ArrowUpFromLine className="h-4 w-4" />
            <span className="text-sm">{post.upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{post.commentCount}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <span>View</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
