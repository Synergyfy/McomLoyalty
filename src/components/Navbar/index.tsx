'use client';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='flex items-center justify-between px-4 py-2'>
      <div className='text-lg font-bold'>Loyalty CardX</div>
      <div className='hidden md:flex items-center gap-4'>
        <a href='#features' className='text-sm font-medium'>
          Features
        </a>
        <a href='#how-it-works' className='text-sm font-medium'>
          How It Works
        </a>
        <a href='#testimonials' className='text-sm font-medium'>
          Testimonials
        </a>
        <a href='#faq' className='text-sm font-medium'>
          FAQ
        </a>
      </div>
      <div className='hidden md:flex items-center gap-2'>
        <Button variant='ghost'>Login</Button>
        <Button>Join Beta</Button>
      </div>
      <div className='md:hidden'>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isOpen && (
        <div className='absolute top-16 left-0 w-full bg-white flex flex-col items-center gap-4 md:hidden'>
          <a href='#features' className='text-sm font-medium'>
            Features
          </a>
          <a href='#how-it-works' className='text-sm font-medium'>
            How It Works
          </a>
          <a href='#testimonials' className='text-sm font-medium'>
            Testimonials
          </a>
          <a href='#faq' className='text-sm font-medium'>
            FAQ
          </a>
          <Button variant='ghost'>Login</Button>
          <Button>Join Beta</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;