'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { RedemptionSuccessDialog } from '@/components/customer/RedemptionSuccessDialog';

import { useParams } from 'next/navigation';
import { useGetPublicCampaignDetail } from '@/services/campaigns/hook';
import { CampaignDetailReward } from '@/services/campaigns/types';
import LoadingSpinner from '@/components/ui/Loading';

export default function RedeemPointsPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;
  const { data: campaign, isLoading, isError, refetch } = useGetPublicCampaignDetail(campaignId);

  const [userPoints, setUserPoints] = useState(200); // Mock user's current points
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<CampaignDetailReward | null>(null);

  // Use rewards from API or empty array
  const rewards = (campaign?.rewards || []) as CampaignDetailReward[];

  const handleRedeemClick = (reward: CampaignDetailReward) => {
    // Logic would need to be updated to handle API redemption
    setSelectedReward(reward);
    const cost = reward.pointsRequired ?? reward.points_required ?? 0;
    setUserPoints(prevPoints => prevPoints - cost); // Deduct points
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
  if (isError || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 px-4 bg-gray-50">
        <p className="text-red-500 font-medium">Error loading redeem points info.</p>
        <Button
          onClick={() => refetch()}
          className="px-6 py-2 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">{campaign.redeemRewardPageTitle || 'Redeem Your Points'}</h1>
          <p className="mt-2 text-lg text-gray-600">{campaign.redeemRewardPageDescription || 'Choose from our exclusive rewards.'}</p>
          <p className="mt-4 text-lg text-gray-600">Current Points: <span className="font-bold text-orange-600">{userPoints}</span></p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rewards.length > 0 ? (
            rewards.map((reward) => {
              const pointsRequired = reward.pointsRequired ?? reward.points_required ?? 0;
              const canRedeem = userPoints >= pointsRequired;
              return (
                <Card key={reward.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={reward.image ?? reward.image_url ?? 'https://images.unsplash.com/photo-1511920183359-b1b5f55c6d4b?auto=format&fit=crop&w=2670&q=80'}
                      alt={reward.title ?? 'Reward'}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">{reward.title ?? 'Reward'}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <CardDescription className="text-lg text-gray-700 mb-4 h-20 line-clamp-3">
                        {reward.description ?? 'Reward details coming soon.'}
                      </CardDescription>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold text-orange-600">{pointsRequired} pts</span>
                        <Gift className="h-8 w-8 text-gray-400" />
                      </div>
                      {/* Progress bar logic would need adjustment based on user points vs goal */}
                      <Progress value={pointsRequired ? Math.min((userPoints / pointsRequired) * 100, 100) : 0} className="mb-4 h-2 bg-orange-100 [&>div]:bg-orange-500" />
                    </div>
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={!canRedeem}
                      onClick={() => handleRedeemClick(reward)}
                    >
                      {canRedeem ? 'Redeem' : `Requires ${pointsRequired} points`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">No rewards available at the moment.</div>
          )}
        </div>
      </div>
      <RedemptionSuccessDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        rewardTitle={selectedReward?.title || ''}
      />
    </div>
  );
}
