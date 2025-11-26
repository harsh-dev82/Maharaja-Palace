import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/BaseComponents';

export const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream via-cream to-gold/10 py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl font-bold text-gold font-playfair mb-4">
            Welcome to Maharaja Palace
          </div>
          <p className="text-2xl text-lightText mb-8 max-w-2xl mx-auto">
            Experience unparalleled luxury and elegance in our world-class 7-star hotel
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/rooms">
              <Button variant="filled" size="lg">
                Book a Room
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="primary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="section-title">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Luxurious Rooms',
              description: 'From single rooms to royal penthouses',
              emoji: '🛏️',
              link: '/rooms',
            },
            {
              title: 'Banquet Halls',
              description: 'Perfect venues for your special events',
              emoji: '💎',
              link: '/banquet',
            },
            {
              title: 'Fine Dining',
              description: 'World-class cuisine and ambiance',
              emoji: '🍽️',
              link: '/restaurant',
            },
          ].map((service, index) => (
            <Link to={service.link} key={index}>
              <div className="bg-white border-2 border-gold p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">{service.emoji}</div>
                <h3 className="text-2xl font-playfair text-gold mb-2">
                  {service.title}
                </h3>
                <p className="text-lightText">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4 border-t-4 border-b-4 border-gold">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Why Choose Maharaja Palace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              '🌟 5-star service with world-class hospitality',
              '🏖️ Stunning architecture and palace-like ambiance',
              '👨‍🍳 Award-winning restaurants and culinary excellence',
              '🎭 World-class entertainment and events',
              '🛎️ 24/7 concierge and premium services',
              '🏋️ State-of-the-art wellness and spa facilities',
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-cream text-lg">✓</span>
                </div>
                <p className="text-lg text-lightText">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-playfair text-gold mb-4">
          Ready for Your Next Experience?
        </h2>
        <p className="text-xl text-lightText mb-8">
          Book your perfect stay or event at Maharaja Palace today
        </p>
        <Link to="/rooms">
          <Button variant="filled" size="lg">
            Book Now
          </Button>
        </Link>
      </section>
    </div>
  );
};
