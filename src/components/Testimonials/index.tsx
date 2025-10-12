import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Testimonials = () => {
  return (
    <section id='testimonials' className='py-20 px-8'>
      <h2 className='text-3xl font-bold text-center mb-8'>
        Loved by Businesses Like Yours
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <Card>
          <CardHeader className='flex flex-row items-center gap-4'>
            <div className='w-12 h-12 bg-gray-300 rounded-full'></div>
            <div>
              <CardTitle>Sophia Carter</CardTitle>
              <p className='text-sm'>Coffee Shop Owner</p>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              “Loyalty CardX has transformed our customer engagement. We’ve seen a
              significant increase in repeat business and customer satisfaction.”
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center gap-4'>
            <div className='w-12 h-12 bg-gray-300 rounded-full'></div>
            <div>
              <CardTitle>Ethan Bennett</CardTitle>
              <p className='text-sm'>Boutique Owner</p>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              “The platform is easy to use and the support team is fantastic.
              It’s been a great addition to our marketing strategy.”
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Testimonials;