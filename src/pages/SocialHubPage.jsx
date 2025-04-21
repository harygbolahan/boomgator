import { Sparkles, Settings, Instagram, Twitter, Facebook, Linkedin, PlusCircle, Calendar, Bell, MessageCircle, Clock, TrendingUp } from "lucide-react";
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
            <h1 className="text-xl font-semibold">Boomgator</h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </header>
        
        <main className="space-y-8">
          <div>
            <h2 className="text-2xl font-medium mb-4">Social Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Twitter className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Twitter</h3>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full">
                  <Instagram className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium">Instagram</h3>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Facebook className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Facebook</h3>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Linkedin className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium">LinkedIn</h3>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 gap-2">
              <PlusCircle className="h-4 w-4" />
              Connect More Platforms
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Quick Post
                </h3>
              </div>
              <textarea 
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-transparent mb-3 text-sm"
                placeholder="What's on your mind?"
                rows={3}
              />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">Twitter</Button>
                  <Button size="sm" variant="outline" className="text-xs">Instagram</Button>
                </div>
                <Button size="sm">Post Now</Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Scheduled Posts
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Twitter className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm">Announcing new feature release</p>
                    <p className="text-xs text-muted-foreground">Today, 3:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                    <Instagram className="h-4 w-4 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm">Product showcase</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 9:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-500" />
                  Notifications
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Twitter className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm">5 new followers</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                    <Instagram className="h-4 w-4 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm">Your post received 20 likes</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-4">Recent Activity</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Twitter className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tweet sent</p>
                      <p className="text-xs text-muted-foreground">Check out our latest update at boomgator.com...</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">3 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                      <Instagram className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Instagram story shared</p>
                      <p className="text-xs text-muted-foreground">New product announcement #boomgator</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Content Calendar
                </h3>
                <Button variant="ghost" size="sm">Open Calendar</Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Upcoming scheduled content for the next 7 days</p>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-50 dark:bg-gray-900 rounded flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-xs font-medium">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
                    <span className="text-xs">{i + 1}</span>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${i % 3 === 0 ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  Quick Stats
                </h3>
                <Button variant="ghost" size="sm">This Week</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Total Followers</p>
                  <p className="text-xl font-medium">2,453</p>
                </div>
                <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Engagement Rate</p>
                  <p className="text-xl font-medium">4.2%</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="mt-20 pt-8 pb-16 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Boomgator. All rights reserved.</p>
          <p className="mt-2">Version 1.0.0</p>
        </footer>
      </div>
    </div>
  );
} 