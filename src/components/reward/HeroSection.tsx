// src/components/reward/HeroSection.tsx
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 text-left md:text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
          Unlock Rewards Everywhere You Go
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Earn points, stamps, cashback, and exclusive deals across all your favourite local businesses.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <a
            href="#"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out w-full md:w-auto text-center"
          >
            Browse Rewards
          </a>
          <a
            href="#"
            className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out w-full md:w-auto text-center"
          >
            Create a Reward
          </a>
        </div>
        {/* Placeholder for optional hero illustration */}
        <div className="mt-12">
          <div className="mx-auto w-full max-w-3xl aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/JZVGabaZHJo"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
