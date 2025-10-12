'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Users, ChevronDown, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname() || '';
  const [isStaffOpen, setIsStaffOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleStaffMenu = () => {
    setIsStaffOpen(!isStaffOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = (
    <nav className="flex flex-col space-y-2">
      <div>
        <button
          onClick={toggleStaffMenu}
          className="flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-lg font-bold text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <span>Staff</span>
          <ChevronDown
            className={`transform transition-transform ${
              isStaffOpen ? 'rotate-180' : ''
            }`}
          - />
        </button>
        {isStaffOpen && (
          <div className="mt-2 flex flex-col space-y-2 pl-4">
            <Link
              href="/dashboard/staff/all"
              className={`rounded-md px-4 py-2 ${
                pathname === '/dashboard/staff/all'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All Staff
            </Link>
            <Link
              href="/dashboard/staff/add"
              className={`rounded-md px-4 py-2 ${
                pathname === '/dashboard/staff/add'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Add Staff
            </Link>
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 sm:hidden">
        <button
          onClick={toggleMobileMenu}
          className="rounded-md bg-white p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 h-full w-64 transform bg-white p-4 shadow-lg transition-transform dark:bg-gray-800 sm:relative sm:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center space-x-2">
          <Users className="h-8 w-8 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
        </div>
        {menuItems}
      </aside>
    </>
  );
};

export default Sidebar;
