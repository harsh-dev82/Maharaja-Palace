import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MarqueeSection } from '../components/MarqueeSection';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {/* Marquee Animation Above Footer */}
      <MarqueeSection />
      <Footer />
    </div>
  );
};
