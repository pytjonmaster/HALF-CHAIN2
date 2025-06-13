import React from 'react';
import { motion } from 'framer-motion';
import CTASection from '@/components/CTASection';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Kote Tsitskishvili",
      image: "/images/team/kote.jpg"
    },
    {
      name: "Levani Tserekashvili",
      image: "/images/team/levani.jpg"
    },
    {
      name: "Mukhrani Shubitidze",
      image: "/images/team/mukhrani.jpg"
    },
    {
      name: "Medea Merabishvili",
      image: "/images/team/medea.jpg"
    },
    {
      name: "Giorgi Tsartsidze",
      image: "/images/team/giorgi.jpg"
    },
    {
      name: "Ana Gigashvili",
      image: "/images/team/ana.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
      {/* About Us and Mission Section - Seamlessly Connected */}
      <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-[#0F1729] via-[#121032] via-[#162138] via-[#1A2847] to-[#21325A]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full">
            <svg className="w-full h-full text-yellow-500/10" viewBox="0 0 400 400">
              {/* Network pattern SVG - this creates the network visualization effect */}
              <pattern id="network-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="1" fill="currentColor" />
                <line x1="25" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" />
                <line x1="25" y1="25" x2="25" y2="50" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#network-pattern)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          {/* About Us */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 md:mb-20">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                About Us
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-invert max-w-none"
              >
                <p className="text-lg text-gray-300 leading-relaxed">
                  HALF-CHAIN is a cutting-edge technology solutions provider, which was founded in November 2022. Our mission is to empower the Web3 community with innovative solutions and simplify complex processes for individuals and businesses.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mt-4">
                  Our team of experts is committed to delivering the highest quality services to our clients. We help businesses and individuals unlock the potential of blockchain technology and leverage its benefits to achieve their goals.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16 md:mb-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-right mb-8">
              Our <span className="text-yellow-500">Mission</span>
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                HALF-CHAIN's vision is to lead the way in the adoption and integration of blockchain technology and other Web3 innovations, empowering individuals and businesses with cutting-edge solutions that simplify complex processes and unlock new opportunities.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We strive to create a more decentralized, transparent, and efficient world where technology is used to promote social and environmental sustainability and communities are empowered to thrive. With a focus on artificial intelligence, metaverse development, smart contract development, and DAO development, we are committed to pushing the boundaries of what is possible.
              </p>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-yellow-500">Team</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg bg-[#1a2234] p-6">
                  <div className="relative w-full pb-[100%]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover object-center rounded-lg"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-white text-center">{member.name}</h3>
                  </div>
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

export default AboutPage; 