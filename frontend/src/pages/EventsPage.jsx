import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/CTASection';

const EventsPage = () => {
  const upcomingEvents = [
    {
      title: "HALF-CHAIN Developer Conference 2024",
      date: "June 15-17, 2024",
      location: "San Francisco, CA",
      attendees: "500+ Expected",
      description: "Join us for three days of intensive workshops, keynotes, and networking focused on blockchain development and smart contract automation.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
    },
    {
      title: "Blockchain Security Summit",
      date: "July 8, 2024",
      location: "London, UK",
      attendees: "300+ Expected",
      description: "A one-day summit focusing on the latest developments in blockchain security and smart contract auditing.",
      image: "https://images.unsplash.com/photo-1515169067868-5387ec356754"
    },
    {
      title: "Smart Contract Innovation Forum",
      date: "August 22-23, 2024",
      location: "Singapore",
      attendees: "400+ Expected",
      description: "Explore the future of smart contracts and their impact on global business operations.",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
      <div className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
        <div className="absolute inset-0 blockchain-pattern opacity-30 -z-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Upcoming <span className="text-yellow-500">Events</span>
            </h1>
            <p className="text-xl text-gray-300">
              Join us at our upcoming events and be part of the blockchain revolution.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 md:py-24 bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#111827] rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 mr-2 text-yellow-500" />
                      {event.attendees}
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-black">
                    Register Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
};

export default EventsPage; 