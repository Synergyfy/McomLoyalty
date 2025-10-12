
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';

const FAQ = () => {
  return (
    <section id='faq' className='py-20 px-8'>
      <h2 className='text-3xl font-bold text-center mb-8'>
        Frequently Asked Questions
      </h2>
      <Accordion type='single' collapsible className='w-full max-w-2xl mx-auto'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>What is Loyalty CardX?</AccordionTrigger>
          <AccordionContent>
            Loyalty CardX is a digital loyalty platform that helps businesses
            create and manage their own loyalty programs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>How does it work?</AccordionTrigger>
          <AccordionContent>
            Customers can join your loyalty program through a unique QR code or
            link. They can then earn points and redeem rewards at your
            business.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>How much does it cost?</AccordionTrigger>
          <AccordionContent>
            We are currently in Beta and offering special pricing for early
            adopters. Contact us to learn more.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default FAQ;
