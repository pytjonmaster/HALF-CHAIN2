import React from 'react';
import { motion } from 'framer-motion';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CTASection from '@/components/CTASection';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
      <div className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 blockchain-pattern opacity-30 -z-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful <span className="text-yellow-500">Features</span>
            </h1>
            <p className="text-xl text-gray-300">
              Discover how HALF-CHAIN's innovative features can transform your approach to smart contracts and blockchain technology.
            </p>
          </motion.div>
        </div>

        <FeaturesSection />
        
        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Advanced <span className="text-yellow-500">Technology</span> Stack
              </h2>
              <p className="text-lg text-gray-300">
                Our platform is built on cutting-edge technology to provide the most secure and efficient smart contract experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <div className="bg-[#1a2234] rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Contract Generation</h3>
                    <p className="text-gray-300">
                      Our advanced AI algorithms analyze your requirements and generate secure, compliant smart contracts tailored to your specific needs.
                    </p>
                  </div>
                  
                  <div className="bg-[#1a2234] rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold mb-3 text-white">Multi-Chain Support</h3>
                    <p className="text-gray-300">
                      Deploy your smart contracts across multiple blockchain networks, including Ethereum, Polygon, Binance Smart Chain, and more.
                    </p>
                  </div>
                  
                  <div className="bg-[#1a2234] rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold mb-3 text-white">Automated Security Audits</h3>
                    <p className="text-gray-300">
                      Our platform automatically audits your smart contracts for security vulnerabilities before deployment, ensuring maximum protection.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                                <div className="relative">
                                      <img  alt="AI-powered smart contract technology" className="w-full h-auto" src="/images/AI.png" />
                </div>
                
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <HowItWorksSection />

        <CTASection />
      </div>
    </div>
  );
};

export default FeaturesPage;
