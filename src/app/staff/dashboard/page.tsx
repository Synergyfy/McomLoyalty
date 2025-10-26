"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  LogOut,
  UserCircle,
  Gift,
  Users,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: "Vouchers Redeemed", value: 128, icon: <Gift /> },
    { label: "Customers Served", value: 94, icon: <Users /> },
    { label: "Active Campaigns", value: 6, icon: <CheckCircle /> },
  ];

  const activities = [
    {
      id: 1,
      customer: "Ama K.",
      voucher: "₵50 Beauty Voucher",
      time: "10 mins ago",
    },
    {
      id: 2,
      customer: "Kwame A.",
      voucher: "₵100 Gift Card",
      time: "25 mins ago",
    },
    {
      id: 3,
      customer: "Efua B.",
      voucher: "₵30 Spa Reward",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-md transition-transform duration-300 md:translate-x-0`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-pink-600">Staff Panel</h2>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-3">
          <Button variant="ghost" className="justify-start">
            <Gift className="h-4 w-4 mr-2" /> Redeem Voucher
          </Button>
          <Button variant="ghost" className="justify-start">
            <Users className="h-4 w-4 mr-2" /> Customers
          </Button>
          <Button variant="ghost" className="justify-start">
            <UserCircle className="h-4 w-4 mr-2" /> My Profile
          </Button>
          <Button variant="ghost" className="justify-start text-red-500 mt-4">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </nav>
      </aside>

      {/* 💻 Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* 🔝 Top Bar */}
        <header className="flex items-center justify-between bg-white shadow-sm p-4 md:px-8">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              Welcome, <span className="text-pink-600">Staff</span>
            </h1>
          </div>

          <UserCircle className="h-8 w-8 text-gray-600" />
        </header>

        {/* 📊 Dashboard Body */}
        <main className="flex-1 p-4 md:p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3"
              >
                <div className="bg-pink-100 text-pink-600 p-3 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-xl font-bold text-gray-800">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Redemptions</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-t border-gray-100">
                <thead className="text-gray-500 border-b bg-gray-50">
                  <tr>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Voucher</th>
                    <th className="py-2 px-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b last:border-none hover:bg-pink-50"
                    >
                      <td className="py-2 px-3 font-medium text-gray-800">
                        {a.customer}
                      </td>
                      <td className="py-2 px-3 text-gray-600">{a.voucher}</td>
                      <td className="py-2 px-3 text-gray-500">{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
