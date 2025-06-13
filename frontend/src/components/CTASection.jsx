import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 -z-10"></div>
      <div className="absolute inset-0 blockchain-pattern opacity-5 -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-yellow-500/90 to-yellow-600 rounded-2xl p-8 md:p-12 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Contract Management?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Join thousands of businesses and individuals who are already benefiting from HALF-CHAIN's AI-powered smart contract platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="rounded-full bg-[#111827] text-yellow-500 hover:bg-[#111827]/90">
                  <Link to="/smart-contracts">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent text-white border-white/50 hover:bg-white/10">
                  <Link to="/features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#111827]/10 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-[#111827]/10 backdrop-blur-sm rounded-xl p-6 border border-[#111827]/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#111827]/10 rounded-lg p-4">
                    <h3 className="text-white font-bold text-lg mb-2">50+</h3>
                    <p className="text-white/70 text-sm">Contract Templates</p>
                  </div>
                  <div className="bg-[#111827]/10 rounded-lg p-4">
                    <h3 className="text-white font-bold text-lg mb-2">99.9%</h3>
                    <p className="text-white/70 text-sm">Uptime Guarantee</p>
                  </div>
                  <div className="bg-[#111827]/10 rounded-lg p-4">
                    <h3 className="text-white font-bold text-lg mb-2">24/7</h3>
                    <p className="text-white/70 text-sm">Expert Support</p>
                  </div>
                  <div className="bg-[#111827]/10 rounded-lg p-4">
                    <h3 className="text-white font-bold text-lg mb-2">10k+</h3>
                    <p className="text-white/70 text-sm">Contracts Created</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
