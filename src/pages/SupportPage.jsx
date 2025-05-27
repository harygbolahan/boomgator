import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBoom } from "@/contexts/BoomContext";
import { toast } from "react-toastify";

export function SupportPage() {
  const { 
    tickets, 
    loadingTickets, 
    ticketsError, 
    getAllTickets, 
    createTicket, 
    replyToTicket 
  } = useBoom();
  
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [replyText, setReplyText] = useState("");
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: ""
  });
  
  // Load tickets on component mount
  useEffect(() => {
    if (activeTab === "tickets") {
      getAllTickets();
    }
  }, [activeTab, getAllTickets]);
  
  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }
    
    const result = await createTicket(newTicket);
    if (result) {
      setNewTicket({ subject: "", message: "" });
      setShowCreateTicket(false);
    }
  };
  
  const handleReplyToTicket = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    
    const result = await replyToTicket(selectedTicket.id, replyText);
    if (result) {
      setReplyText("");
      // Update the selected ticket with new replies
      const updatedTickets = await getAllTickets();
      const updatedTicket = updatedTickets.find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">
          Manage your support tickets.
        </p>
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
      
      {/* Support Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="space-y-6"> 
          {!selectedTicket ? (
            <>
              {/* Tickets Header */}
                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div className="relative flex-1 max-w-md">
                   <input
                     type="search"
                     placeholder="Search tickets..."
                     className="w-full p-3 pl-12 border rounded-lg bg-background"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                   <div className="absolute left-4 top-3.5">
                     🔍
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <Button 
                     variant="outline"
                     onClick={getAllTickets}
                     disabled={loadingTickets}
                   >
                     {loadingTickets ? "Refreshing..." : "🔄 Refresh"}
                   </Button>
                   <Button 
                     onClick={() => setShowCreateTicket(true)}
                     className="whitespace-nowrap"
                   >
                     Create New Ticket
                   </Button>
                 </div>
               </div>
              
              {/* Create Ticket Modal */}
              {showCreateTicket && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card rounded-xl shadow-lg border max-w-md w-full p-6">
                    <h3 className="text-lg font-medium mb-4">Create New Support Ticket</h3>
                    
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">
                          Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          className="w-full p-2 border rounded-lg bg-background"
                          placeholder="Brief description of your issue"
                          value={newTicket.subject}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full p-2 border rounded-lg bg-background"
                          placeholder="Please describe your issue in detail..."
                          value={newTicket.message}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCreateTicket(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loadingTickets}>
                          {loadingTickets ? "Creating..." : "Create Ticket"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Tickets List */}
              <div className="bg-card rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-medium">Your Support Tickets</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                
                {loadingTickets ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading tickets...</p>
                  </div>
                ) : ticketsError ? (
                  <div className="p-6 text-center">
                    <p className="text-red-500">Error: {ticketsError}</p>
                    <Button 
                      variant="outline" 
                      onClick={getAllTickets}
                      className="mt-2"
                    >
                      Retry
                    </Button>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No tickets found</p>
                    <Button 
                      onClick={() => setShowCreateTicket(true)}
                      className="mt-2"
                    >
                      Create Your First Ticket
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredTickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className="p-6 hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{ticket.subject}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {ticket.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Ticket #{ticket.id}</span>
                              <span>Created: {formatDate(ticket.created_at)}</span>
                              {ticket.replies && ticket.replies.length > 0 && (
                                <span>{ticket.replies.length} repl{ticket.replies.length === 1 ? 'y' : 'ies'}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground">
                              {ticket.updated_at ? `Updated: ${formatDate(ticket.updated_at)}` : 'No updates'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Ticket Detail View */
            <div className="space-y-6">
                             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <Button 
                     variant="outline" 
                     onClick={() => setSelectedTicket(null)}
                   >
                     ← Back to Tickets
                   </Button>
                   <div className="flex items-center gap-2">
                     <h3 className="text-lg font-medium">Ticket #{selectedTicket.id}</h3>
                     <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedTicket.status)}`}>
                       {selectedTicket.status}
                     </span>
                   </div>
                 </div>
                 <Button 
                   variant="outline" 
                   onClick={async () => {
                     const updatedTickets = await getAllTickets();
                     const updatedTicket = updatedTickets.find(t => t.id === selectedTicket.id);
                     if (updatedTicket) {
                       setSelectedTicket(updatedTicket);
                     }
                   }}
                   disabled={loadingTickets}
                 >
                   {loadingTickets ? "Refreshing..." : "🔄 Refresh"}
                 </Button>
               </div>
              
              <div className="bg-card rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h4 className="font-medium text-lg mb-2">{selectedTicket.subject}</h4>
                  <div className="text-sm text-muted-foreground">
                    Created: {formatDate(selectedTicket.created_at)}
                    {selectedTicket.updated_at && (
                      <span className="ml-4">Updated: {formatDate(selectedTicket.updated_at)}</span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Original Message */}
                    <div className="bg-accent/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          You
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(selectedTicket.created_at)}
                        </span>
                      </div>
                      <p className="text-sm">{selectedTicket.message}</p>
                    </div>
                    
                                         {/* Replies */}
                     {selectedTicket.replies && selectedTicket.replies.map((reply) => {
                       const isAdmin = reply.reply_by === 'Admin';
                       return (
                         <div key={reply.id} className={`rounded-lg p-4 ${
                           isAdmin 
                             ? 'bg-blue-50 border border-blue-200' 
                             : 'bg-accent/10'
                         }`}>
                           <div className="flex items-center gap-2 mb-2">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                               isAdmin 
                                 ? 'bg-blue-500 text-white' 
                                 : 'bg-secondary text-foreground'
                             }`}>
                               {isAdmin ? 'A' : 'You'}
                             </div>
                             <span className={`text-sm font-medium ${
                               isAdmin ? 'text-blue-700' : 'text-foreground'
                             }`}>
                               {isAdmin ? 'Admin' : 'You'}
                             </span>
                             <span className="text-sm text-muted-foreground">
                               {formatDate(reply.created_at)}
                             </span>
                           </div>
                           <p className="text-sm">{reply.reply}</p>
                         </div>
                       );
                     })}
                    
                    {/* Reply Form */}
                    {selectedTicket.status !== 'closed' && (
                      <form onSubmit={handleReplyToTicket} className="space-y-4">
                        <div>
                          <label htmlFor="reply" className="block text-sm font-medium mb-1">
                            Add Reply
                          </label>
                          <textarea
                            id="reply"
                            rows={3}
                            className="w-full p-3 border rounded-lg bg-background"
                            placeholder="Type your reply here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            required
                          ></textarea>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={loadingTickets}>
                            {loadingTickets ? "Sending..." : "Send Reply"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
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
    </div>
  );
}

// Sample data
const tabs = [
  { id: "tickets", name: "Support Tickets" },
  // { id: "documentation", name: "Documentation" },
  // { id: "faqs", name: "FAQs" }
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