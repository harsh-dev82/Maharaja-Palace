import React from 'react';

const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="text-6xl mb-8">🎨</div>
      <h1 className="text-5xl font-playfair text-gold mb-4">{title}</h1>
      <p className="text-xl text-lightText max-w-2xl">{description}</p>
      <div className="mt-8 bg-cream border-2 border-gold p-6 rounded-lg">
        <p className="text-lightText">Coming soon in Phase 2 & Phase 3</p>
      </div>
    </div>
  );
};

export const GalleryPage = () => (
  <PlaceholderPage
    title="Gallery"
    description="Explore stunning photography of our palace, rooms, and facilities"
  />
);

export const AboutPage = () => (
  <PlaceholderPage
    title="About Maharaja Palace"
    description="Discover the rich history and heritage of Maharaja Palace Hotel"
  />
);

export const ContactPage = () => (
  <PlaceholderPage
    title="Contact Us"
    description="Get in touch with our team for reservations and inquiries"
  />
);

export const NotFoundPage = () => (
  <PlaceholderPage
    title="Page Not Found"
    description="The page you are looking for doesn't exist or has been moved"
  />
);
