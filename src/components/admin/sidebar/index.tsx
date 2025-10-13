
import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-5">
      <h2 className="text-lg font-semibold mb-5">Admin Menu</h2>
      <ul>
        <li className="mb-2"><Link href="/admin/dashboard" className="hover:text-primary">Dashboard</Link></li>
        <li className="mb-2"><Link href="/admin/users" className="hover:text-primary">Users</Link></li>
        <li className="mb-2"><Link href="/admin/settings" className="hover:text-primary">Settings</Link></li>
      </ul>
    </div>
  );
}
