import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { user, signout } = useAuth();

  const handleSignOut = () => {
    signout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-[#0F1729]/50 to-[#121032]/50 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/images/logo.png" alt="HALF-CHAIN" className="h-8 w-auto" />
              </Link>
              <nav className="hidden md:flex ml-12 space-x-8">
                <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors text-sm">About Us</Link>
                <Link to="/events" className="text-foreground/80 hover:text-primary transition-colors text-sm">Events</Link>
                <Link to="/smart-contracts" className="text-foreground/80 hover:text-primary transition-colors text-sm">Smart Contracts</Link>
                <Link to="/features" className="text-foreground/80 hover:text-primary transition-colors text-sm">Features</Link>
                <Link to="/compliance" className="text-foreground/80 hover:text-primary transition-colors text-sm">Compliance</Link>
                <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors text-sm">Contact Us</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" className="flex items-center space-x-2 text-foreground/80 hover:text-primary transition-colors">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user.email}</span>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSignOut}
                    className="text-sm flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/signin">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-sm ${location.pathname === '/signin' ? 'bg-muted' : ''}`}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="sm" 
                      className={`text-sm ${location.pathname === '/signup' ? 'bg-primary/90' : ''}`}
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 