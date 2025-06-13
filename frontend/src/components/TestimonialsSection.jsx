import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "HALF-CHAIN has revolutionized how we handle contracts. The AI-powered system saves us countless hours of legal review while ensuring compliance.",
    author: "Sarah Johnson",
    position: "CFO, TechVentures Inc.",
    rating: 5,
    avatarInitial: "S"
  },
  {
    quote: "The simplicity of creating complex smart contracts through their interface is remarkable. Our legal team was impressed with the accuracy and compliance features.",
    author: "Michael Chen",
    position: "Legal Director, BlockFin",
    rating: 5,
    avatarInitial: "M"
  },
  {
    quote: "As a small business owner, I never thought blockchain technology would be accessible to me. HALF-CHAIN changed that with their intuitive platform.",
    author: "David Rodriguez",
    position: "Founder, InnovateCo",
    rating: 4,
    avatarInitial: "D"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Trusted by <span className="text-yellow-500">Industry Leaders</span>
          </h2>
          <p className="text-lg text-gray-300">
            See what our clients say about their experience with HALF-CHAIN's smart contract platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full custom-gradient-card hover:border-yellow-500/50 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-6 text-gray-300">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/80 to-yellow-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.avatarInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-300">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
