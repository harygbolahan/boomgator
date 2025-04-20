import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="px-4 py-4 border-b bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Boomgator</h1>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#integrations" className="hover:text-primary">Integrations</a>
            <a href="#testimonials" className="hover:text-primary">Testimonials</a>
            <a href="#pricing" className="hover:text-primary">Pricing</a>
            <Link to="/login" className="hover:text-primary">Login</Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
          <button className="md:hidden">☰</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Automate Your Social Media <br className="hidden md:block" />
            <span className="text-primary">Engagement and Growth</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Schedule posts, automate responses, and grow your audience across all major social platforms with intelligent automation tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="px-8">Start Free Trial</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="px-8">Learn More</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-accent/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Powerful Automation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Works With Your Favorite Platforms</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            Seamlessly integrate with all major social media platforms and payment processors.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
            {integrations.map((integration, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                  {integration.icon}
                </div>
                <span className="text-sm font-medium">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-accent/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    {testimonial.initial}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Social Presence?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of businesses that use Boomgator to automate their social media engagement.
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-8">Get Started Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Boomgator</h3>
              <p className="text-muted-foreground max-w-xs">
                Automate your social media engagement and grow your audience with intelligent tools.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Integrations</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Enterprise</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Guides</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Boomgator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sample data
const features = [
  {
    icon: "💬",
    title: "Comment Automation",
    description: "Automatically respond to comments on your posts and ads across Facebook and Instagram."
  },
  {
    icon: "🔑",
    title: "Keyword Triggers",
    description: "Set up automated responses based on specific keywords or phrases in direct messages."
  },
  {
    icon: "📱",
    title: "Story Automation",
    description: "Automate replies to story mentions and create conversation flows from story interactions."
  },
  {
    icon: "🔄",
    title: "Multi-Platform Scheduling",
    description: "Schedule and publish content across all major social media platforms from one dashboard."
  },
  {
    icon: "📊",
    title: "Advanced Analytics",
    description: "Get detailed insights into engagement, conversion rates, and audience growth."
  },
  {
    icon: "💳",
    title: "Payment Integration",
    description: "Process payments directly through PayPal, Stripe, or Paystack integrations."
  }
];

const integrations = [
  { name: "Facebook", icon: "f" },
  { name: "Instagram", icon: "📸" },
  { name: "Twitter", icon: "𝕏" },
  { name: "LinkedIn", icon: "in" },
  { name: "YouTube", icon: "▶️" },
  { name: "TikTok", icon: "🎵" },
  { name: "Pinterest", icon: "📌" },
  { name: "PayPal", icon: "💰" },
  { name: "Stripe", icon: "💳" },
  { name: "Paystack", icon: "💲" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "Marketing Director",
    initial: "S",
    quote: "Boomgator has completely transformed how we manage our social media. The automation features have saved us hours every week."
  },
  {
    name: "Michael Chen",
    position: "E-commerce Entrepreneur",
    initial: "M",
    quote: "The payment integration feature has been a game-changer for our business. We've seen a 40% increase in conversion rates."
  },
  {
    name: "Jessica Williams",
    position: "Social Media Manager",
    initial: "J",
    quote: "The scheduling tools are intuitive and powerful. I can manage multiple clients' accounts effortlessly from one dashboard."
  }
]; 