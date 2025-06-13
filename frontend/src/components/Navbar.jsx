import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = () => {
    signout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About us', path: '/features' },
    { name: 'Events', path: '/smart-contracts' },
    { name: 'Contact', path: '/compliance' },
  ];

  const AuthButtons = () => (
    <div className="flex items-center space-x-3">
      {user ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <User size={20} />
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="text-sm border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-gray-800"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <>
          <Link to="/signin">
            <Button variant="ghost" size="sm" className="text-sm text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-gray-800">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button 
              size="sm" 
              className="text-sm bg-yellow-500 text-white hover:bg-yellow-600 border-none dark:bg-yellow-400 dark:hover:bg-yellow-500"
            >
              Sign up
            </Button>
          </Link>
        </>
      )}
      <div className="border-l border-gray-200 dark:border-gray-700 pl-3 ml-3">
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-border dark:bg-gray-900/80 dark:border-gray-800'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center transition-transform hover:scale-105"
              aria-label="Go to homepage"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <img src="/images/logo.png" alt="HALF-CHAIN Logo" className="h-10 w-auto" />
              </motion.div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8 ml-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                      'text-sm font-medium transition-colors hover:text-yellow-600 dark:hover:text-yellow-400',
                      isActive ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground/80 dark:text-gray-300',
                      link.name === 'Home' ? 'font-semibold' : ''
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          </div>

          <div className="hidden md:block">
            <AuthButtons />
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-foreground hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-border shadow-lg dark:bg-gray-900 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'px-3 py-2 rounded-md text-base font-medium',
                        isActive
                          ? 'bg-yellow-50 text-yellow-600 dark:bg-gray-800 dark:text-yellow-400'
                          : 'text-foreground/80 hover:bg-yellow-50 hover:text-yellow-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-yellow-400',
                        link.name === 'Home' ? 'font-semibold' : ''
                      )
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <div className="pt-4 border-t border-border dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <AuthButtons />
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
