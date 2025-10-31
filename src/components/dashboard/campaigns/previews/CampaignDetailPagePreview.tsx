'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Calendar, Tag, Info, Gift, CheckCircle, Users, Trophy } from "lucide-react";
import { CampaignFormData } from "@/context/CampaignFormContext";

interface CampaignDetailPagePreviewProps {
  campaignData: CampaignFormData;
}

export default function CampaignDetailPagePreview({ campaignData }: CampaignDetailPagePreviewProps) {
  // Using campaignData passed as prop instead of mockCampaign
  const campaign = campaignData;

  // Placeholder for handleJoin - actual join logic won't be in preview
  const handleJoin = () => {
    alert('This is a preview. Join functionality is not active here.');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section - Title and Headline */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={campaign.imageUrl || 'https://via.placeholder.com/1920x700?text=Campaign+Hero'}
          alt={campaign.campaignName || 'Campaign Hero'}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end pb-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-white text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              {campaign.campaignName || '[Campaign Name]'}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-md">
              {campaign.campaignMessage || '[Campaign Tagline/Message]'}
            </p>
            <Button
              onClick={handleJoin}
              className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {campaign.ctaButtonText || 'Join Campaign & Get Reward'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-10 -mt-20">
          {/* Campaign Description */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Campaign</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {campaign.campaignMessage || '[Campaign Description]'}
            </p>
          </section>

          {/* Key Information */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 shadow-md border-l-4 border-orange-600">
              <CardHeader className="!p-0 mb-3">
                <CardTitle className="text-xl font-semibold flex items-center text-gray-800">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Campaign Period
                </CardTitle>
              </CardHeader>
              <CardContent className="!p-0 text-gray-700 text-lg">
                <p>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '[Start Date]'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '[End Date]'}</p>
              </CardContent>
            </Card>
            <Card className="p-6 shadow-md border-l-4 border-orange-600">
              <CardHeader className="!p-0 mb-3">
                <CardTitle className="text-xl font-semibold flex items-center text-gray-800">
                  <Tag className="w-5 h-5 mr-2 text-orange-600" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent className="!p-0 text-gray-700 text-lg">
                <p>{campaign.campaignType || '[Category]'}</p>
              </CardContent>
            </Card>
          </section>

          {/* Eligibility & Limits */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Eligibility & Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-md border-l-4 border-orange-600">
                <CardHeader className="!p-0 mb-3">
                  <CardTitle className="text-xl font-semibold flex items-center text-gray-800">
                    <Users className="w-5 h-5 mr-2 text-orange-600" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent className="!p-0 text-gray-700 text-lg">
                  {campaign.audienceType.length > 0 ? (
                    <p>
                      {campaign.audienceType.map((type, index) => {
                        let audienceText = '';
                        if (type === 'members') audienceText = 'All Members';
                        if (type === 'badge_level') audienceText = `Members with ${campaign.badgeLevel || '[Level]'} Badge`;
                        if (type === 'wishlist_target') audienceText = `Wishlist for "${campaign.wishlistItemId || '[Item]'}"`;
                        return (
                          <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-1">
                            {audienceText}
                          </span>
                        );
                      }).join(', ')}
                    </p>
                  ) : (
                    <p>All Customers</p>
                  )}
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md border-l-4 border-orange-600">
                <CardHeader className="!p-0 mb-3">
                  <CardTitle className="text-xl font-semibold flex items-center text-gray-800">
                    <Info className="w-5 h-5 mr-2 text-orange-600" />
                    Campaign Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="!p-0 text-gray-700 text-lg">
                  {Number(campaign.rewardsAvailable) > 0 && <p>Rewards Available: {campaign.rewardsAvailable}</p>}
                  {Number(campaign.schedulingRules?.stopAfterClaims) > 0 && <p>Stops After: {campaign.schedulingRules.stopAfterClaims} Claims</p>}
                  {(Number(campaign.rewardsAvailable) === 0 && Number(campaign.schedulingRules?.stopAfterClaims) === 0) && <p>Unlimited Rewards/Claims</p>}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Multiple Rewards Display */}
          {/* This section would dynamically display rewards based on formData.rewardIds */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Rewards in this Campaign</h2>
            <p className="text-gray-600">[Dynamic Rewards Display based on selected rewardIds]</p>
          </section>

          {/* How to Earn */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How to Participate & Earn</h2>
            <p className="text-gray-600">[Dynamic How-to-Earn instructions]</p>
          </section>

          {/* Terms and Conditions */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>
            <p className="text-gray-600">[Dynamic Terms and Conditions]</p>
          </section>
        </div>
      </div>

      {/* Sticky Join Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-20">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Button
            onClick={handleJoin}
            className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white text-lg px-12 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {campaign.ctaButtonText || 'Join Campaign & Get Reward'}
          </Button>
        </div>
      </div>
    </div>
  );
}
