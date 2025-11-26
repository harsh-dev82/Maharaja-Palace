import React from 'react';
import { Navbar, Footer } from './Navbar';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream/20">
      <Navbar />
      <Breadcrumbs />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
