"use client"
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import PrivacySection from '@/components/PrivacySection';
import React from 'react';
import { Poppins } from 'next/font/google';
import ChatWidget from '@/components/ChatWidget';
import BusHero from '@/components/BusHero';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import WhyChooseUs from '@/components/WhyChooseUs';

// Import the font directly
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function Page() {
  return (
    <div
      className={`${poppins.className} min-h-screen`}
    >
      <Navbar />
      <Hero />
      <PrivacySection />
      <BusHero />
      <HowItWorks />
      <Testimonials />
      <WhyChooseUs />

      <ChatWidget excludePages={["/login", "/signup"]} />
      <Footer />
    </div>
  );
}
