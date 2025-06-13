import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signin, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signin(email, password, rememberMe);
      toast({
        title: "Success!",
        description: "You have been signed in successfully.",
        variant: 'default',
      });
      navigate(from);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Success!",
        description: "You have been signed in with Google successfully.",
        variant: 'default',
      });
      navigate(from);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Load Google Identity Services script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Identity Services loaded');
    };
    script.onerror = () => {
      console.error('Failed to load Google Identity Services');
    };
    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Script might already be removed
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-3xl font-bold text-center text-yellow-500 mb-8">Sign In</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#0F1729]/60 to-[#121032]/60 backdrop-blur-sm border border-gray-700 text-gray-300 focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#0F1729]/60 to-[#121032]/60 backdrop-blur-sm border border-gray-700 text-gray-300 focus:outline-none focus:border-yellow-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-gradient-to-r from-[#0F1729]/60 to-[#121032]/60 text-yellow-500 focus:ring-yellow-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-yellow-500">
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors py-3 rounded-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-r from-[#0F1729]/80 to-[#121032]/80 text-gray-400">or sign in with</span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-700 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M23.766 12.2764c0-.4714-.039-.9285-.116-1.3714h-11.59v2.5997h6.645c-.287 1.5534-1.158 2.8697-2.467 3.7585v3.1246h3.99c2.334-2.1508 3.678-5.3216 3.678-8.1114z" fill="#4285F4"/>
                    <path d="M12.06 23.9014c3.33 0 6.118-1.1014 8.155-2.9714l-3.99-3.1246c-1.106.7428-2.516 1.1797-4.165 1.1797-3.204 0-5.914-2.1643-6.877-5.0826H1.06v3.2246c2.02 4.0096 6.177 6.7743 11 6.7743z" fill="#34A853"/>
                    <path d="M5.183 13.9015c-.247-.7428-.387-1.537-.387-2.3515s.14-1.6087.387-2.3515V6.0239H1.06A11.9678 11.9678 0 0 0 0 12.0015c0 1.9872.476 3.8677 1.06 5.5246l4.123-3.1246z" fill="#FBBC04"/>
                    <path d="M12.06 4.5768c1.807 0 3.424.6214 4.705 1.8413l3.534-3.5341C18.203 1.1288 15.415 0 12.06 0 7.237 0 3.08 2.7647 1.06 6.7743l4.123 3.2246c.963-2.9183 3.673-5.0826 6.877-5.0826z" fill="#EA4335"/>
                  </svg>
                )}
                <span className="text-gray-900">
                  {googleLoading ? 'Signing in...' : 'Google'}
                </span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-yellow-500 hover:text-yellow-400">
              Sign Up <ArrowRight className="inline-block h-4 w-4 ml-1" />
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer */}
              <footer className="bg-gradient-to-r from-[#1A2847]/50 to-[#21325A]/50 border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <img src="/images/logo.png" alt="HALF-CHAIN" className="h-8 w-auto" />
              </Link>
              <p className="text-sm text-gray-400 mb-6">
                AI-powered smart contract automation and blockchain technology for security and transparency.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/HalfChain" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110" 
                  aria-label="Follow us on Facebook"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/half_chain/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110" 
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@half_chain" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110" 
                  aria-label="Follow us on TikTok"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/half_chain" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110" 
                  aria-label="Follow us on X (formerly Twitter)"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/86815573" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110" 
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-yellow-500 text-sm">Features</Link></li>
                <li><Link to="/smart-contracts" className="text-gray-400 hover:text-yellow-500 text-sm">Smart Contracts</Link></li>
                <li><Link to="/compliance" className="text-gray-400 hover:text-yellow-500 text-sm">Compliance</Link></li>
                <li><Link to="/api-docs" className="text-gray-400 hover:text-yellow-500 text-sm">API Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-yellow-500 text-sm">About Us</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-yellow-500 text-sm">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-yellow-500 text-sm">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-yellow-500 text-sm">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-yellow-500 text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-yellow-500 text-sm">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-yellow-500 text-sm">Cookie Policy</Link></li>
                <li><Link to="/security" className="text-gray-400 hover:text-yellow-500 text-sm">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">© 2025 HALF-CHAIN. All rights reserved.</p>
              <p className="text-sm text-gray-400 mt-2 md:mt-0">Powered by advanced blockchain technology and AI</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignIn; 