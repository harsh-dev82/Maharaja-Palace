import React from 'react';
import { Button } from '../components/BaseComponents';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        {/* Large 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-serif text-[#B8860B] mb-4">404</h1>
          <div className="w-24 h-[2px] bg-[#B8860B] mx-auto"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable. Please check the URL or return to the homepage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="filled" 
            size="lg"
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </Button>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/rooms" className="text-[#B8860B] hover:text-[#8B6914] text-sm">
              Rooms
            </a>
            <a href="/restaurant" className="text-[#B8860B] hover:text-[#8B6914] text-sm">
              Restaurant
            </a>
            <a href="/banquet" className="text-[#B8860B] hover:text-[#8B6914] text-sm">
              Banquet Halls
            </a>
            <a href="/gallery" className="text-[#B8860B] hover:text-[#8B6914] text-sm">
              Gallery
            </a>
            <a href="/contact" className="text-[#B8860B] hover:text-[#8B6914] text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};