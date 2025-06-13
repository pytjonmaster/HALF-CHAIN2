import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  const { signup, error, loading } = useAuth();

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords don't match");
      return;
    }

    try {
      await signup(formData.email, formData.password);
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
        variant: 'default',
      });
      navigate(from);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

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
          <h1 className="text-3xl font-bold text-center text-yellow-500 mb-8">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || validationError) && (
              <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
                <div className="text-sm text-red-500">{error || validationError}</div>
              </div>
            )}
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#0F1729]/60 to-[#121032]/60 backdrop-blur-sm border border-gray-700 text-gray-300 focus:outline-none focus:border-yellow-500"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#0F1729]/60 to-[#121032]/60 backdrop-blur-sm border border-gray-700 text-gray-300 focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#0F1729]/60 to-[#121032]/60 backdrop-blur-sm border border-gray-700 text-gray-300 focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <div className="custom-gradient-card rounded-lg p-4">
              <p className="text-sm font-medium text-gray-300 mb-2">Password requirements:</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  One number
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors py-3 rounded-lg"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-yellow-500 hover:text-yellow-400">
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
} 