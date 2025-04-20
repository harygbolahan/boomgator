import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SupportPage() {
  const [activeTab, setActiveTab] = useState("documentation");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">
          Find answers to your questions or contact our support team.
        </p>
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <input
          type="search"
          placeholder="Search for help articles..."
          className="w-full p-3 pl-12 border rounded-lg bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute left-4 top-3.5">
          🔍
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Documentation Tab */}
      {activeTab === "documentation" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-4">Documentation</h3>
              <nav className="space-y-1">
                {documentationCategories.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium py-2">{category.name}</h4>
                    <ul className="space-y-1 pl-4">
                      {category.topics.map((topic, i) => (
                        <li key={i}>
                          <a href="#" className="text-primary hover:underline text-sm py-1 block">
                            {topic}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-medium mb-2">Getting Started with Boomgator</h3>
              <p className="text-muted-foreground mb-4">Learn the basics to set up your account and start automating your social media.</p>
              
              <div className="space-y-4 mt-6">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-medium">Setting Up Your Account</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete your profile, connect your social media accounts, and customize your dashboard.
                  </p>
                  <a href="#" className="text-primary text-sm hover:underline mt-2 inline-block">
                    Read more →
                  </a>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-medium">Connecting Social Media Accounts</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn how to connect and manage various social media platforms to your Boomgator account.
                  </p>
                  <a href="#" className="text-primary text-sm hover:underline mt-2 inline-block">
                    Read more →
                  </a>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-medium">Creating Your First Automation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set up automated responses for comments, messages, and other social media engagements.
                  </p>
                  <a href="#" className="text-primary text-sm hover:underline mt-2 inline-block">
                    Read more →
                  </a>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-medium">Scheduling Posts</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn how to create and schedule posts across multiple social platforms from one dashboard.
                  </p>
                  <a href="#" className="text-primary text-sm hover:underline mt-2 inline-block">
                    Read more →
                  </a>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-2">Video Tutorials</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-accent flex items-center justify-center">
                      ▶️
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm">Complete Boomgator Walkthrough</h5>
                      <p className="text-xs text-muted-foreground mt-1">5:32</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-accent flex items-center justify-center">
                      ▶️
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm">Setting Up Keyword Triggers</h5>
                      <p className="text-xs text-muted-foreground mt-1">3:45</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button className="w-full text-left p-4 font-medium flex justify-between items-center">
                    {faq.question}
                    <span>+</span>
                  </button>
                  <div className="p-4 border-t bg-accent/10">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Popular Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTopics.map((topic, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="block p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <h4 className="font-medium mb-1">{topic.title}</h4>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Contact Tab */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-6">Contact Support</h3>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-2 border rounded-lg bg-background"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-2 border rounded-lg bg-background"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="">Select a subject</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing Questions</option>
                    <option value="technical">Technical Support</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full p-2 border rounded-lg bg-background"
                    placeholder="Please describe your issue or question in detail..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <Button>Submit Ticket</Button>
                </div>
              </form>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium mb-4">Support Hours</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday:</span>
                    <span>9:00 AM - 8:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday:</span>
                    <span>10:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    We typically respond to support tickets within 24 hours during business days.
                  </p>
                </div>
              </div>
              
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium mb-4">Community Support</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Facebook Community Group</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Join our Facebook group to connect with other users, share tips, and get help.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Join Group
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium">Knowledge Base</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Browse our extensive knowledge base for tutorials and guides.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Visit Knowledge Base
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sample data
const tabs = [
  { id: "documentation", name: "Documentation" },
  { id: "faqs", name: "FAQs" },
  { id: "contact", name: "Contact Support" }
];

const documentationCategories = [
  {
    name: "Getting Started",
    topics: [
      "Account Setup",
      "Connecting Social Accounts",
      "Dashboard Overview",
      "Quick Start Guide"
    ]
  },
  {
    name: "Automation",
    topics: [
      "Comment Automation",
      "Keyword Triggers",
      "Story Mentions",
      "Automation Rules",
      "AI Response Templates"
    ]
  },
  {
    name: "Content Calendar",
    topics: [
      "Scheduling Posts",
      "Content Creation",
      "Bulk Scheduling",
      "Post Analytics"
    ]
  },
  {
    name: "Analytics & Reporting",
    topics: [
      "Dashboard Metrics",
      "Custom Reports",
      "Data Export",
      "Performance Insights"
    ]
  },
  {
    name: "Integrations",
    topics: [
      "Social Media Platforms",
      "Payment Processors",
      "API Documentation",
      "Webhooks Setup"
    ]
  }
];

const faqs = [
  {
    question: "How do I connect my social media accounts?",
    answer: "You can connect your social media accounts by going to the Integrations page, clicking on 'Add Account', and following the authentication steps for each platform."
  },
  {
    question: "What types of automation can I set up?",
    answer: "Boomgator supports various types of automation including comment responses, keyword triggers in messages, story mention replies, and scheduled posting across multiple platforms."
  },
  {
    question: "How many social accounts can I connect?",
    answer: "The number of social accounts you can connect depends on your subscription plan. Free plans allow up to 3 accounts, while paid plans offer unlimited social account connections."
  },
  {
    question: "Can I schedule posts to multiple platforms at once?",
    answer: "Yes! With Boomgator's Content Calendar, you can create a post once and schedule it to be published across multiple platforms simultaneously or at different times."
  },
  {
    question: "How do I set up keyword triggers for messages?",
    answer: "Navigate to the Automation page, select 'Keyword Triggers', click 'Create Automation', and then define your keywords and corresponding automated responses."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards (via Stripe), PayPal, and Paystack. You can manage your payment methods in the Account > Billing section."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription at any time by going to Account > Billing > Current Plan and clicking the 'Cancel Plan' button. Your plan will remain active until the end of your current billing period."
  }
];

const popularTopics = [
  {
    title: "Setting Up Automations",
    description: "Learn how to create and manage automation workflows."
  },
  {
    title: "Content Scheduling",
    description: "Tips for effective content scheduling across platforms."
  },
  {
    title: "Analytics Reporting",
    description: "Getting the most from your performance data."
  },
  {
    title: "Account Security",
    description: "Best practices for securing your Boomgator account."
  },
  {
    title: "Payment & Billing",
    description: "Manage subscription plans and payment methods."
  },
  {
    title: "API Integration",
    description: "Using Boomgator's API for custom integrations."
  }
]; 