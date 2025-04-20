import { SocialDashboard } from "@/components/social/SocialDashboard";
import { Sparkles, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6 py-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Social Manager Pro</h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </header>
        
        <main>
          <SocialDashboard />
        </main>
        
        <footer className="mt-20 pt-8 pb-16 border-t text-center text-sm text-muted-foreground">
          <p>© 2023 Social Manager Pro. All rights reserved.</p>
          <p className="mt-2">Version 1.0.0</p>
        </footer>
      </div>
    </div>
  );
} 