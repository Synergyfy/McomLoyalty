import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const HowItWorks = () => {
  return (
    <section id='how-it-works' className='py-20 px-8'>
      <h2 className='text-3xl font-bold text-center mb-8'>How It Works</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <Card>
          <CardHeader>
            <div className='w-full h-48 bg-gray-300'></div>
          </CardHeader>
          <CardContent>
            <h3 className='font-bold'>Step 1: Create Your Promotion</h3>
            <p>
              Design your loyalty program with our intuitive interface. Choose
              rewards, set rules, and customize the look and feel.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className='w-full h-48 bg-gray-300'></div>
          </CardHeader>
          <CardContent>
            <h3 className='font-bold'>Step 2: Share with Customers</h3>
            <p>
              Share your promotion via email, social media, or in-store QR
              codes. Make it easy for customers to join.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className='w-full h-48 bg-gray-300'></div>
          </CardHeader>
          <CardContent>
            <h3 className='font-bold'>Step 3: Watch Your Business Grow</h3>
            <p>
              Track customer engagement, reward redemption, and overall impact on
              your business. Make data-driven decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorks;