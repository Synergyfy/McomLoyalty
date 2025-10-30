'use client';

import React from 'react';
import Header from '@/components/campaigns/Header';
import Footer from '@/components/campaigns/Footer';

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
