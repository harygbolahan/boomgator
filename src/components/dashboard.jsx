import React from "react";
import { Button } from "@/components/ui/button";

export function BoomgatorDashboard() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-background rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Boomgator Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your social media accounts</p>
        </div>
        <Button>Add Account</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {socialCards.map((card, index) => (
          <SocialCard key={index} {...card} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EngagementChart />
        <RecentActivity />
      </div>
    </div>
  );
}

function SocialCard({ platform, username, icon, followers, growth, color }) {
  const isPositive = growth > 0;
  
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{platform}</h3>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold">{followers.toLocaleString()}</p>
        <div className="flex items-center gap-1">
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "↑" : "↓"} {Math.abs(growth)}%
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      </div>
    </div>
  );
}

function EngagementChart() {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-medium mb-6">Engagement Overview</h3>
      <div className="h-60 flex items-end justify-between gap-2">
        {engagementData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div 
              className="w-full bg-primary/20 rounded-t-sm" 
              style={{ height: `${item.value}%` }}
            ></div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-medium mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sample Data
const socialCards = [
  {
    platform: "Twitter",
    username: "yourusername",
    icon: "𝕏",
    followers: 8524,
    growth: 2.6,
    color: "bg-blue-100 dark:bg-blue-950"
  },
  {
    platform: "Instagram",
    username: "yourusername",
    icon: "📸",
    followers: 12632,
    growth: 5.1,
    color: "bg-pink-100 dark:bg-pink-950"
  },
  {
    platform: "YouTube",
    username: "YourChannel",
    icon: "▶️",
    followers: 4218,
    growth: -0.8,
    color: "bg-red-100 dark:bg-red-950"
  },
  {
    platform: "LinkedIn",
    username: "yourname",
    icon: "🔗",
    followers: 3856,
    growth: 3.2,
    color: "bg-sky-100 dark:bg-sky-950"
  }
];

const engagementData = [
  { label: "Mon", value: 45 },
  { label: "Tue", value: 60 },
  { label: "Wed", value: 75 },
  { label: "Thu", value: 65 },
  { label: "Fri", value: 80 },
  { label: "Sat", value: 90 },
  { label: "Sun", value: 70 }
];

const recentActivities = [
  {
    title: "New Followers on Twitter",
    description: "You gained 24 new followers in the last 24 hours",
    time: "2h ago",
    icon: "𝕏",
    color: "bg-blue-100 dark:bg-blue-950"
  },
  {
    title: "Post Performance",
    description: "Your latest Instagram post reached 3.4k people",
    time: "5h ago",
    icon: "📸",
    color: "bg-pink-100 dark:bg-pink-950"
  },
  {
    title: "Comment Engagement",
    description: "You received 18 new comments on your recent videos",
    time: "8h ago",
    icon: "▶️",
    color: "bg-red-100 dark:bg-red-950"
  },
  {
    title: "Profile Visit Spike",
    description: "Your LinkedIn profile visits increased by 43%",
    time: "1d ago",
    icon: "🔗",
    color: "bg-sky-100 dark:bg-sky-950"
  }
]; 