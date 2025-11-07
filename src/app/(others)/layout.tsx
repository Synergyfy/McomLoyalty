import React from 'react';
import Footer from '@/components/Footer';
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: {
    default: "Loyalty CardX",
    template: "%s — Loyalty CardX",
  },
  description: "Empowering local businesses with smart, simple loyalty programs.",
};
const OthersLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex flex-col">
                    <main className="min-h-screen bg-white text-gray-800">
                        {children}
                    </main>
                    
                    <Footer />
                     
                    </div>
                </body>
            </html>
        );
    };

export default OthersLayout;
