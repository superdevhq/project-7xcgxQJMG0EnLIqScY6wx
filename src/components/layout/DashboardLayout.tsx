
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-primary">Reddit Scraper Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Future Supabase Auth</span>
          </div>
        </div>
      </header>
      <main className={cn("container px-4 py-6", className)}>
        {children}
      </main>
      <footer className="border-t bg-white py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          Reddit Scraper Dashboard &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
