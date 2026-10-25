import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedRooms from '../components/FeaturedRooms';
import StayInfo from '../components/StayInfo';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <main>
        <Hero />
        <FeaturedRooms />
        <Features />
        <StayInfo />
      </main>
      <Footer />
    </div>
  );
}
