'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { WishlistButton } from '@/components/customer/wishlist/WishlistButton';
import { WishlistModal } from '@/components/customer/wishlist/WishlistModal';
import { useGetAllPublicCampaigns } from '@/services/campaigns/hook';
import { PublicCampaignResponse } from '@/services/campaigns/types';
import LoadingSpinner from '@/components/ui/Loading';
import { SafeImage } from '@/components/ui/SafeImage';

const formatCategory = (campaignType?: string | null) => {
  if (!campaignType) return 'Other';
  return campaignType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const LIMIT = 12;

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [selectedWishlistItemName, setSelectedWishlistItemName] = useState<string | undefined>();
  const { data, isLoading, isError, refetch } = useGetAllPublicCampaigns(1, LIMIT);
  const campaigns: PublicCampaignResponse[] = data?.data ?? [];

  const categories = useMemo(() => {
    const dynamicCategories = Array.from(
      new Set(
        campaigns
          .map((campaign) => formatCategory(campaign.campaign_type))
          .filter((category) => !!category),
      ),
    );
    return ['All', ...dynamicCategories];
  }, [campaigns]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  const handleWishlistClick = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedWishlistItemName(title);
    setIsWishlistModalOpen(true);
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign: PublicCampaignResponse) => {
      const categoryLabel = formatCategory(campaign.campaign_type);
      const matchesCategory = selectedCategory === 'All' || categoryLabel === selectedCategory;
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (campaign.campaign_message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, campaigns]);

  const handleWishlistSave = () => {
    console.log('Wishlist item saved');
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-gray-600">We couldn&apos;t load campaigns right now.</p>
        <Button onClick={() => refetch()} className="bg-orange-600 hover:bg-orange-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 pt-28 md:pt-36 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">Explore Campaigns</h1>
            <p className="mt-4 text-lg text-gray-600">Discover offers and rewards from businesses you love.</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-10">
            <div className="relative max-w-lg mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for campaigns..."
                className="w-full pl-10 pr-4 py-2 h-12 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex justify-center flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Campaign Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <div className="relative h-48 w-full">
                  <SafeImage
                    src={campaign.banner_url || undefined}
                    alt={campaign.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    {formatCategory(campaign.campaign_type)}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/30 rounded-full backdrop-blur-sm">
                    <WishlistButton onClick={(e) => handleWishlistClick(e, campaign.name)} />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">{campaign.name}</h2>
                  <p className="text-gray-600 mb-4 h-20 overflow-hidden">
                    {campaign.campaign_message || 'No description provided.'}
                  </p>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredCampaigns.length === 0 && (
            <p className="text-center text-gray-500 mt-12">No campaigns found. Try adjusting your search or filters.</p>
          )}
        </div>
      </div>
      <WishlistModal 
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        itemName={selectedWishlistItemName}
        onSave={handleWishlistSave}
      />
    </>
  );
}
