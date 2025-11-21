'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Tag, Info, CheckCircle, Users, Trophy } from "lucide-react";
import { SignUpDialog } from '@/components/customer/SignUpDialog';
import { useCampaignMembership } from '@/context/CampaignMembershipContext';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/Loading';
import { useGetPublicCampaignDetail } from '@/services/campaigns/hook';
import { CampaignDetailReward, PublicCampaignDetailResponse } from '@/services/campaigns/types';
import { SafeImage } from '@/components/ui/SafeImage';

interface PageProps {
  params: Promise<{ campaignId: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface NormalizedReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  value?: string;
  image: string;
  quantity: number;
}

interface NormalizedCampaignDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  heroImageUrl: string;
  businessLogoUrl?: string | null;
  businessName?: string;
  startDate?: string;
  endDate?: string;
  category: string;
  campaignType?: string;
  rewardsAvailable: number;
  audienceType: string[];
  badgeLevel?: string;
  wishlistItemId?: string;
  stopAfterClaims: number;
  rewards: NormalizedReward[];
  howToEarn: string[];
  termsAndConditions: string[];
}

const formatCategory = (campaignType?: string | null) => {
  if (!campaignType) return 'General';
  return campaignType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const splitToList = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(/\r?\n|•/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const audienceLabels: Record<string, string> = {
  members: 'All Members',
  'badge_level': 'Specific Badge Level',
  members_only: 'Members Only',
  public: 'All Customers',
};

const normalizeAudience = (audienceType?: string | string[]) => {
  if (!audienceType) return [] as string[];
  const raw = Array.isArray(audienceType) ? audienceType : [audienceType];
  return raw.map((type) => audienceLabels[type] || type);
};

const normalizeReward = (reward: CampaignDetailReward, index: number): NormalizedReward => {
  const points = reward.pointsRequired ?? reward.points_required ?? 0;
  const value = reward.value !== undefined && reward.value !== null ? String(reward.value) : undefined;

  return {
    id: reward.id ?? `reward-${index}`,
    title: reward.title ?? reward.name ?? 'Campaign Reward',
    description: reward.description ?? 'Reward details coming soon.',
    pointsRequired: typeof points === 'number' ? points : Number(points) || 0,
    value,
    image: reward.image ?? reward.image_url ?? 'https://via.placeholder.com/400x300?text=Reward',
    quantity: reward.quantity ?? 0,
  };
};

const normalizeCampaignDetail = (data?: PublicCampaignDetailResponse): NormalizedCampaignDetail | null => {
  if (!data) return null;

  const rewards = (data.rewards ?? []).map((reward, index) => normalizeReward(reward, index));

  return {
    id: data.id,
    title: data.name,
    tagline: data.campaignMessage ?? data.earnPointPageTitle ?? 'Join this exciting campaign!',
    description: data.redeemRewardPageDescription ?? data.earnPointPageDescription ?? data.campaignMessage ?? 'Campaign details coming soon.',
    heroImageUrl: data.bannerUrl ?? 'https://via.placeholder.com/1600x900?text=Campaign',
    businessLogoUrl: data.logoUrl,
    businessName: data.business?.name,
    startDate: data.startDate,
    endDate: data.endDate,
    category: formatCategory(data.campaignType),
    campaignType: data.campaignType,
    rewardsAvailable: data.quantity ?? rewards.length ?? 0,
    audienceType: normalizeAudience(data.audienceType),
    badgeLevel: undefined,
    wishlistItemId: undefined,
    stopAfterClaims: data.quantity ?? 0,
    rewards,
    howToEarn: splitToList(data.earnPointPageDescription),
    termsAndConditions: splitToList(data.redeemRewardPageDescription),
  };
};

export default function CampaignDetailPage({ params }: PageProps) {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const { isMember, memberName } = useCampaignMembership();
  const resolvedParams = React.use(params);
  const { campaignId } = resolvedParams;
  const { data, isLoading, isError, refetch } = useGetPublicCampaignDetail(campaignId);
  const campaign = normalizeCampaignDetail(data);

  const handleJoinClick = () => {
    setIsSignUpDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
        <p className="text-gray-600">Unable to load this campaign right now.</p>
        <Button onClick={() => refetch()} className="bg-orange-600 hover:bg-orange-700">Try Again</Button>
      </div>
    );
  }

  if (!campaign) {
    return <p className="text-center text-lg text-red-500 py-20">Campaign not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="relative">
        {/* Hero Section - Title and Headline */}
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <SafeImage
            src={campaign.heroImageUrl}
            alt={campaign.title}
            fill
            className="object-cover brightness-75"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end pb-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto text-white text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                {campaign.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-md">
                {isMember ? `Welcome, ${memberName}!` : campaign.tagline}
              </p>
              {!isMember && (
                <Button
                  onClick={handleJoinClick}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Join Campaign & Get Reward
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-12 px-4 md:px-8 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-10 -mt-20">
            {isMember && (
              <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">You have joined this campaign. Welcome, {memberName}!</p>
                  </div>
                </div>
              </div>
            )}
            {!isMember && (
              <>
                {/* Campaign Description */}
                <section>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">About This Campaign</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {campaign.description}
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
                      <p>
                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'TBA'} -{' '}
                        {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'TBA'}
                      </p>
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
                      <p>{campaign.category}</p>
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
                            {campaign.audienceType.map((label, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-1">
                                {label}
                              </span>
                            ))}
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
                        {campaign.rewardsAvailable > 0 && <p>Rewards Available: {campaign.rewardsAvailable}</p>}
                        {campaign.stopAfterClaims > 0 && <p>Stops After: {campaign.stopAfterClaims} Claims</p>}
                        {campaign.rewardsAvailable === 0 && campaign.stopAfterClaims === 0 && <p>Unlimited Rewards/Claims</p>}
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </>
            )}

            {/* Multiple Rewards Display */}
            {campaign.rewards && campaign.rewards.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Rewards in this Campaign</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.rewards.map((rewardItem) => (
                    <Card key={rewardItem.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                      <div className="relative h-48 w-full">
                        <SafeImage
                          src={rewardItem.image}
                          alt={rewardItem.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{rewardItem.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{rewardItem.description}</p>
                        <div className="flex justify-between items-center text-md font-semibold text-gray-700">
                          <p className="flex items-center"><Trophy className="w-4 h-4 mr-2 text-blue-500" /> {rewardItem.pointsRequired > 0 ? `${rewardItem.pointsRequired} Points` : 'No Points Req.'}</p>
                          {rewardItem.value && <p>{rewardItem.value}</p>}
                        </div>
                        {rewardItem.quantity > 0 && (
                          <p className="text-xs text-gray-500 mt-2">Limited: {rewardItem.quantity} available</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {!isMember && (
              <>
                {/* How to Earn */}
                {campaign.howToEarn && campaign.howToEarn.length > 0 && (
                  <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">How to Participate & Earn</h2>
                    <ul className="space-y-3 text-lg text-gray-700">
                      {campaign.howToEarn.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-6 h-6 mr-3 text-green-500 flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Terms and Conditions */}
                {campaign.termsAndConditions && campaign.termsAndConditions.length > 0 && (
                  <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Terms & Conditions</h2>
                    <ul className="space-y-3 text-base text-gray-600 list-disc pl-5">
                      {campaign.termsAndConditions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sticky Join Button */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-20">
          <div className="max-w-4xl mx-auto flex justify-center">
            {isMember ? (
              <Link href="/campaigns/my-points" passHref>
                <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-lg px-12 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                  View My Points
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleJoinClick}
                className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white text-lg px-12 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Join Campaign & Get Reward
              </Button>
            )}
          </div>
        </div>
      </div>
      <SignUpDialog
        isOpen={isSignUpDialogOpen}
        onClose={() => setIsSignUpDialogOpen(false)}
        campaignTitle={campaign.title}
      />
    </div>
  );
}
