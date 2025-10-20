import React from 'react';
import Link from 'next/link';
import { Award, LayoutDashboard } from 'lucide-react';

export default function BusinessSidebar() {
  return (
    <div className="fixed h-screen w-64 bg-gray-900 text-white p-5 z-50 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-5">Business Menu</h2>
      <ul>
        <li className="mb-2">
          <Link href="/dashboard" className="flex items-center hover:text-primary">
            <LayoutDashboard className="mr-2" />
            Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/dashboard/rewards" className="flex items-center hover:text-primary">
            <Award className="mr-2" />
            Rewards
          </Link>
        </li>
      </ul>
    </div>
  );
}
