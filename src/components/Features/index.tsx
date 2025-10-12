import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Features = () => {
  return (
    <section id='features' className='py-20 px-8'>
      <h2 className='text-3xl font-bold text-center mb-8'>
        Why Choose Loyalty CardX?
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Engage Your Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Connect with your customers on a personal level and keep them
              coming back.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reward Loyalty</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Offer exclusive rewards and incentives to your most loyal customers.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Track Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Monitor your promotion's success and optimize for better results.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Features;