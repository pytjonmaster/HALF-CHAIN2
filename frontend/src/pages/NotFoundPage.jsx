import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
      <div className="absolute inset-0 blockchain-pattern opacity-30 -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-yellow-500">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Page Not Found</h2>
            <p className="text-xl text-gray-300 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            
            <Button asChild size="lg" className="rounded-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
