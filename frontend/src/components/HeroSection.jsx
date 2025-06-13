import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const fullCode = `pragma solidity ^0.8.0;

contract AIGenerated {
    address public owner;
    mapping(address => uint256) balances;
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}`;

  useEffect(() => {
    if (currentIndex < fullCode.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + fullCode[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullCode]);

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-black/5 z-10"></div>
      <div className="absolute inset-0 blockchain-pattern opacity-30 -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
              Smart Contract <span className="text-yellow-500">Automation</span> Powered by AI
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
              HALF-CHAIN combines blockchain technology with AI to create secure, 
              transparent, and compliant smart contracts for businesses and individuals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link to="/smart-contracts">
                  Create Smart Contract <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full text-white hover:bg-white/10">
                <Link to="/features">
                  Explore Features
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center mt-8 text-sm text-gray-300">
              <Shield className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Enterprise-grade security</span>
              <span className="mx-2">•</span>
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Regulatory compliant</span>
              <span className="mx-2">•</span>
              <FileText className="h-5 w-5 mr-2 text-yellow-500" />
              <span>AML/KYC integrated</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-400">smart-contract.sol</span>
              </div>
              <pre className="text-green-400 text-sm min-h-[320px]">
                <code>
                  {displayedCode}
                  <span className="animate-pulse text-white">|</span>
                </code>
              </pre>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-2xl blur-xl"></div>
            
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/30 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl opacity-40"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
