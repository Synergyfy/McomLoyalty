'use client';

import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import TierBadge from "@/components/ui/tierBadge";
import Image from 'next/image';

export default function BusinessProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    businessName: 'Bella’s Bakery',
    email: 'bella@bakery.com',
    phone: '+234 810 234 5678',
    address: '12 Marina Road, Lagos',
    category: 'Food & Drink',
    description: 'Delicious pastries and desserts made fresh daily!',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    // TODO: Add save logic or API call
    console.log('Profile updated:', form);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm  mt-8 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-6 mb-8">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1614289371518-722f2615943c?auto=format&fit=crop&w=200&q=80"
              alt="Business Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 shadow-md"
              width={96}
              height={96}
            />
            <button
              className="absolute bottom-1 right-1 bg-orange-500 text-white p-1.5 rounded-full hover:bg-orange-600 transition"
              title="Change photo"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Business Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{form.businessName}</h1>
            <p className="text-gray-500">{form.category}</p>
            <div className="mt-2">
              <TierBadge tier="Gold" />
            </div>
          </div>
        </div>

        {/* Edit / Save Button */}
        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className={`mt-4 md:mt-0 px-6 py-2 rounded-full font-semibold transition ${
            editing
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            <Mail size={14} className="inline mr-1 text-orange-500" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            <Phone size={14} className="inline mr-1 text-orange-500" />
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            <MapPin size={14} className="inline mr-1 text-orange-500" />
            Business Address
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            <Building2 size={14} className="inline mr-1 text-orange-500" />
            About Your Business
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={!editing}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50 resize-none"
          />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>Joined: March 2024</p>
        <p>Account Type: <span className="text-orange-500 font-medium">Gold Partner</span></p>
      </div>
    </div>
  );
}
