import React from 'react';

const Footer = () => {
  return (
    <footer className='py-8 px-8 border-t'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
        <p>&copy; 2025 Loyalty CardX. All rights reserved.</p>
        <div className='flex gap-4'>
          <a href='#' className='text-sm'>
            Terms of Service
          </a>
          <a href='#' className='text-sm'>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;