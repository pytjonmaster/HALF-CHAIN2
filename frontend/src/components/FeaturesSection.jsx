import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, FileCheck, Zap, RefreshCw, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Brain className="h-10 w-10 text-yellow-500" />,
    title: 'AI-Powered Automation',
    description: 'Our AI analyzes and generates smart contracts based on your specific requirements, saving time and reducing errors.'
  },
  {
    icon: <Shield className="h-10 w-10 text-yellow-500" />,
    title: 'Blockchain Security',
    description: 'Leverage the power of blockchain technology to ensure immutable, transparent, and secure contract execution.'
  },
  {
    icon: <FileCheck className="h-10 w-10 text-yellow-500" />,
    title: 'Regulatory Compliance',
    description: 'Built-in AML/KYC verification ensures all contracts meet regulatory requirements across jurisdictions.'
  },
  {
    icon: <Zap className="h-10 w-10 text-yellow-500" />,
    title: 'Instant Deployment',
    description: 'Deploy smart contracts instantly to multiple blockchain networks with just a few clicks.'
  },
  {
    icon: <RefreshCw className="h-10 w-10 text-yellow-500" />,
    title: 'Seamless Integration',
    description: 'Easily integrate with existing systems through our comprehensive API and developer tools.'
  },
  {
    icon: <Lock className="h-10 w-10 text-yellow-500" />,
    title: 'Enterprise Security',
    description: 'Enterprise-grade security protocols protect your data and contracts at every step of the process.'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Powerful Features for <span className="text-yellow-500">Smart Contract</span> Management
          </h2>
          <p className="text-lg text-gray-300">
            Our platform combines cutting-edge technology with user-friendly interfaces to make smart contract creation and management accessible to everyone.
          </p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full custom-gradient-card hover:border-yellow-500/50 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                <CardHeader>
                  <div className="mb-4 p-3 bg-yellow-500/10 rounded-full w-fit">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
