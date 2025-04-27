import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const featureCardVariant = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 10
    }
  }
};

export function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header/Navigation */}
      <header className="px-4 py-4 border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          >
            Boomgator
          </motion.h1>
          <nav className="hidden md:flex gap-8 items-center">
            {['features', 'integrations', 'testimonials', 'pricing'].map((item, index) => (
              <motion.a 
                key={item}
                href={`#${item}`} 
                className="hover:text-primary relative transition-colors duration-300"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/login" className="hover:text-primary transition-colors duration-300">Login</Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup">
                <Button className="shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 border-none">Get Started</Button>
              </Link>
            </motion.div>
          </nav>
          <motion.button 
            className="md:hidden relative z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            <div className="flex flex-col justify-center items-center w-8 h-8">
              <motion.span 
                className="block w-6 h-0.5 bg-foreground my-0.5 rounded-full"
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="block w-6 h-0.5 bg-foreground my-0.5 rounded-full"
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="block w-6 h-0.5 bg-foreground my-0.5 rounded-full"
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8 p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {['features', 'integrations', 'testimonials', 'pricing'].map((item, index) => (
              <motion.a 
                key={item}
                href={`#${item}`} 
                className="text-2xl font-medium hover:text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login" className="text-2xl font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mt-4"
            >
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button size="lg" className="shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 border-none px-8">Get Started</Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-24 pb-32 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-3xl"></div>
        
        {/* Animated circles */}
        <motion.div 
          className="absolute top-20 left-[20%] w-6 h-6 rounded-full bg-primary/20"
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-32 right-[30%] w-4 h-4 rounded-full bg-blue-400/30"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        />
        <motion.div 
          className="absolute top-40 right-[25%] w-8 h-8 rounded-full bg-purple-400/20"
          animate={{ 
            y: [0, 25, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5 
          }}
        />
        
        <motion.div 
          style={{ opacity }}
          className="container mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <motion.div 
            className="absolute -top-10 left-0 right-0 mx-auto w-32 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            animate={{ 
              width: ["0%", "50%", "0%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
            variants={fadeIn}
          >
            Automate Your <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Social Media</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10 rounded-full blur-sm"></span>
            </span> <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Engagement and Growth</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            variants={fadeIn}
          >
            Schedule posts, automate responses, and grow your audience across all major social platforms with intelligent automation tools.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup">
                <Button size="lg" className="px-8 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 border-none">Start Free Trial</Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="#features">
                <Button size="lg" variant="outline" className="px-8 border-primary/20 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">Learn More</Button>
              </a>
            </motion.div>
          </motion.div>
          
          {/* 3D Dashboard Mockup */}
          <motion.div 
            className="mt-20 relative h-[350px] md:h-[450px] mx-auto max-w-5xl perspective-[1200px]"
            style={{ y }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div 
              className="w-full h-full origin-bottom"
              initial={{ rotateX: 30 }}
              animate={{ rotateX: 25 }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 bottom-0 h-20"></div>
              <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-primary/10 bg-card/80 backdrop-filter backdrop-blur-sm">
                <div className="w-full h-8 bg-card flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 text-xs text-center text-muted-foreground">Boomgator Dashboard</div>
                </div>
                <div className="grid grid-cols-12 gap-4 p-4 h-full">
                  <div className="col-span-3 h-full">
                    <div className="bg-accent/30 rounded-lg p-3 h-1/3 mb-3">
                      <div className="h-3 w-2/3 bg-primary/20 rounded mb-2"></div>
                      <div className="h-2 w-full bg-muted rounded mb-2"></div>
                      <div className="h-2 w-3/4 bg-muted rounded"></div>
                    </div>
                    <div className="bg-accent/20 rounded-lg p-3 h-2/3">
                      <div className="h-3 w-1/2 bg-primary/20 rounded mb-3"></div>
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex items-center gap-2 mb-3">
                          <div className="h-6 w-6 rounded-full bg-primary/10"></div>
                          <div className="h-2 w-20 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-6 bg-accent/10 rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between mb-4">
                      <div className="h-3 w-20 bg-primary/20 rounded"></div>
                      <div className="flex gap-2">
                        <div className="h-5 w-5 rounded bg-accent/50"></div>
                        <div className="h-5 w-5 rounded bg-accent/50"></div>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="bg-accent/20 rounded-lg p-3">
                        <div className="h-3 w-14 bg-primary/20 rounded mb-2"></div>
                        <div className="h-8 w-full bg-card rounded mb-1"></div>
                        <div className="h-2 w-3/4 bg-muted rounded"></div>
                      </div>
                      <div className="bg-accent/20 rounded-lg p-3">
                        <div className="h-3 w-14 bg-primary/20 rounded mb-2"></div>
                        <div className="h-8 w-full bg-card rounded mb-1"></div>
                        <div className="h-2 w-3/4 bg-muted rounded"></div>
                      </div>
                      <div className="bg-accent/20 rounded-lg p-3">
                        <div className="h-3 w-14 bg-primary/20 rounded mb-2"></div>
                        <div className="h-8 w-full bg-card rounded mb-1"></div>
                        <div className="h-2 w-3/4 bg-muted rounded"></div>
                      </div>
                      <div className="bg-accent/20 rounded-lg p-3">
                        <div className="h-3 w-14 bg-primary/20 rounded mb-2"></div>
                        <div className="h-8 w-full bg-card rounded mb-1"></div>
                        <div className="h-2 w-3/4 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 flex flex-col gap-3">
                    <div className="bg-accent/30 rounded-lg p-3 h-1/2">
                      <div className="h-3 w-3/4 bg-primary/20 rounded mb-2"></div>
                      <div className="h-24 w-full bg-gradient-to-b from-primary/20 to-blue-500/10 rounded mb-2"></div>
                      <div className="h-2 w-full bg-muted rounded mb-1"></div>
                      <div className="h-2 w-2/3 bg-muted rounded"></div>
                    </div>
                    <div className="bg-accent/20 rounded-lg p-3 h-1/2">
                      <div className="h-3 w-1/2 bg-primary/20 rounded mb-3"></div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-2 w-12 bg-muted rounded"></div>
                        <div className="h-2 w-8 bg-primary/20 rounded"></div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-2 w-12 bg-muted rounded"></div>
                        <div className="h-2 w-12 bg-primary/30 rounded"></div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-2 w-12 bg-muted rounded"></div>
                        <div className="h-2 w-6 bg-primary/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reflection */}
              <div className="absolute -bottom-16 left-0 right-0 mx-auto w-[90%] h-20 bg-gradient-to-b from-primary/10 to-transparent blur-xl rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-accent/20 relative">
        {/* Subtle patterns */}
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]"></div>
        <motion.div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></motion.div>
        <motion.div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></motion.div>
        
        <motion.div 
          className="container mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <motion.span 
            className="block text-center text-sm font-medium text-primary mb-3"
            variants={fadeIn}
          >
            STREAMLINE YOUR WORKFLOW
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeIn}
          >
            Powerful Automation Features
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground max-w-2xl mx-auto mb-16"
            variants={fadeIn}
          >
            Everything you need to streamline your social media workflow
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="group relative bg-card p-8 rounded-xl shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                variants={featureCardVariant}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Background Pattern */}
                <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  {/* Animated Dots */}
                  <motion.div 
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary/40 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                  <motion.div 
                    className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-blue-400/40 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.5, 1] }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                
                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground group-hover:text-muted-foreground/90 transition-colors duration-300">{feature.description}</p>
                  
                  {/* Learn More Link */}
                  <div className="mt-6 pt-4 border-t border-primary/10">
                    <a href="#" className="inline-flex items-center text-primary text-sm font-medium">
                      Learn more 
                      <motion.span 
                        className="ml-1 text-xs"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Feature Highlight */}
          <motion.div 
            className="mt-20 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 p-8 lg:p-12 overflow-hidden relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"></div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
              <div className="lg:w-1/2">
                <motion.span 
                  className="text-sm font-medium text-primary mb-2 block"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  FEATURED FUNCTIONALITY
                </motion.span>
                <motion.h3 
                  className="text-2xl md:text-3xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Smart AI-Powered Response System
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Our advanced AI analyzes customer sentiment and context to deliver personalized responses that feel human. Save hours of manual work while maintaining authentic engagement with your audience.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 border-none shadow-lg shadow-primary/20">
                    Try Smart Responses
                  </Button>
                </motion.div>
              </div>
              
              <div className="lg:w-1/2">
                <motion.div 
                  className="bg-accent/20 rounded-xl p-4 border border-primary/10 shadow-inner"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-xs">
                      👤
                    </div>
                    <div className="bg-accent/30 rounded-lg p-3 shadow-sm">
                      <p className="text-sm">Hey! I've been using your product for a week now, but I'm having trouble with scheduling posts. Can you help?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-4 pl-12">
                    <motion.div 
                      className="w-full max-w-xs"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <div className="flex justify-start gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-accent/50 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted"></div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-accent/50 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted"></div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg p-3 shadow-sm">
                        <p className="text-sm">Hi there! I'm sorry to hear you're having trouble with scheduling. Our scheduling tool is located in the top right menu under "Content". Have you tried accessing it from there?</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-xs">
                      👤
                    </div>
                    <motion.div 
                      className="bg-accent/30 rounded-lg p-3 shadow-sm"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      <p className="text-sm">Yes! I found it. Thank you so much for the quick help!</p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <motion.div 
          className="container mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-4"
            variants={fadeIn}
          >
            Works With Your Favorite Platforms
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground max-w-2xl mx-auto mb-16"
            variants={fadeIn}
          >
            Seamlessly integrate with all major social media platforms and payment processors.
          </motion.p>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center"
            variants={staggerContainer}
          >
            {integrations.map((integration, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center"
                variants={featureCardVariant}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center mb-4 text-2xl shadow-md">
                  {integration.icon}
                </div>
                <span className="text-sm font-medium">{integration.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-accent/20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]"></div>
        <motion.div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></motion.div>
        <motion.div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></motion.div>
        
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 left-[15%] w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-transparent"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/10 to-transparent"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        />
        
        <motion.div 
          className="container mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <motion.span 
            className="block text-center text-sm font-medium text-primary mb-3"
            variants={fadeIn}
          >
            CUSTOMER STORIES
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={fadeIn}
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            className="text-center text-muted-foreground max-w-2xl mx-auto mb-16"
            variants={fadeIn}
          >
            Join thousands of satisfied users who've transformed their social media strategy
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="relative bg-card/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group"
                variants={featureCardVariant}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Quote icon */}
                <div className="absolute top-6 right-6 text-2xl text-primary/20 group-hover:text-primary/30 transition-colors duration-300">"</div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.svg 
                        key={star}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4 text-primary"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: 0.1 * star,
                          duration: 0.3,
                          type: "spring"
                        }}
                      >
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </motion.svg>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic mb-8">"<span className="text-foreground">{testimonial.quote}</span>"</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-blue-600/30 flex items-center justify-center text-lg font-semibold text-primary shadow-md border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.initial}
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors duration-300">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    </div>
                  </div>
                  
                  {/* Company logo/icon */}
                  <div className="absolute bottom-8 right-8">
                    <div className="w-6 h-6 rounded-full bg-accent/40 flex items-center justify-center text-xs">
                      {testimonial.initial}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Statistics */}
          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {[
              { value: "10K+", label: "Active Users" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "24/7", label: "Customer Support" },
              { value: "80+", label: "Platform Integrations" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 100 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/testimonials">
              <Button variant="outline" className="border-primary/20 hover:border-primary/40">
                View All Customer Stories
                <motion.span 
                  className="ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                >
                  →
                </motion.span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.025] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/80"></div>
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-3xl"></div>
        
        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="container mx-auto text-center relative z-10 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <div className="bg-card/80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-primary/10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/10 blur-xl"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"></div>
            
            <motion.div 
              className="w-20 h-1.5 bg-gradient-to-r from-primary/40 to-blue-500/40 rounded-full mx-auto mb-8"
              animate={{ width: ["60%", "20%", "60%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <motion.span 
              className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              LIMITED TIME OFFER
            </motion.span>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 relative"
              variants={fadeIn}
            >
              Ready to Grow Your 
              <span className="relative ml-2">
                <span className="relative z-10 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Social Presence?</span>
                <motion.span 
                  className="absolute bottom-1 left-0 right-0 h-3 bg-primary/10 rounded-full -z-10"
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              variants={fadeIn}
            >
              Join thousands of businesses that use Boomgator to automate their social media engagement.
            </motion.p>
            
            <motion.div
              className="flex flex-col md:flex-row gap-4 justify-center"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/signup">
                  <Button size="lg" className="px-12 py-6 text-lg shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 border-none">
                    Get Started Today
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="px-12 py-6 text-lg border-primary/20 shadow-sm hover:shadow-md hover:border-primary/30">
                    Schedule Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>No credit card required. 14-day free trial.</span>
            </motion.div>
          </div>
          
          {/* Trust badges */}
          <motion.div 
            className="mt-12 flex flex-wrap justify-center gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-sm text-muted-foreground">Trusted by brands worldwide:</span>
            {["Brand 1", "Brand 2", "Brand 3", "Brand 4"].map((brand, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent/50"></div>
                <span className="text-sm font-medium">{brand}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <motion.div 
              className="mb-8 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Boomgator</h3>
              <p className="text-muted-foreground max-w-xs">
                Automate your social media engagement and grow your audience with intelligent tools.
              </p>
              <div className="flex gap-4 mt-6">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social, index) => (
                  <motion.a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 rounded-full bg-accent/40 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social[0].toUpperCase()}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Integrations", "Enterprise"]
                },
                {
                  title: "Company",
                  links: ["About", "Careers", "Blog", "Contact"]
                },
                {
                  title: "Resources",
                  links: ["Documentation", "Guides", "Support", "API"]
                },
                {
                  title: "Legal",
                  links: ["Privacy", "Terms", "Security"]
                }
              ].map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                >
                  <h4 className="font-semibold mb-4">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={link}>
                        <motion.a 
                          href="#" 
                          className="text-muted-foreground hover:text-primary transition-colors duration-300"
                          whileHover={{ x: 2 }}
                        >
                          {link}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div 
            className="mt-12 pt-8 border-t text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p>© {new Date().getFullYear()} Boomgator. All rights reserved.</p>
          </motion.div>
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