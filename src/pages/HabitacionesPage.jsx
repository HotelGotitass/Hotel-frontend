import React from 'react';
import Navbar from '../components/Navbar';
import PublicRooms from '../components/PublicRooms';
import Footer from '../components/Footer';

export default function HabitacionesPage() {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <PublicRooms />
      </main>
      <Footer />
    </div>
  );
}
