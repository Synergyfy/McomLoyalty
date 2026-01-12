'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, Calendar, Users, BarChart } from 'lucide-react';
import { useGetMyCreatedCampaigns } from '@/services/campaigns/hook';
import { CampaignResponse, CampaignType } from '@/services/campaigns/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AwardPointsModal } from '@/components/staff/AwardPointsModal';

export default function SuperBusinessMatchingView() {
  const { data: campaignsData, isLoading } = useGetMyCreatedCampaigns({ page: 1, limit: 100 });
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignResponse | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  // Filter for MATCHING_POINT campaigns
  const matchingCampaigns = campaignsData?.data?.filter(
    (c) => c.campaignType === CampaignType.MATCHING_POINT || c.campaignType === 'matching_point'
  ) || [];

  const handleAwardClick = (campaign: CampaignResponse) => {
    setSelectedCampaign(campaign);
    setIsAwardModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Matching Campaigns</h2>
          <p className="text-gray-500">Manage your matching point campaigns and award points to businesses.</p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard/campaigns/create'}>
          Create New Campaign
        </Button>
      </div>

      {matchingCampaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <BarChart className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Matching Campaigns</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              You haven't created any matching point campaigns yet. Start by creating one to allow other businesses to earn points.
            </p>
            <Button onClick={() => window.location.href = '/dashboard/campaigns/create'}>
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matchingCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden flex flex-col">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant={campaign.disabled ? "destructive" : "default"} className="mb-2">
                    {campaign.disabled ? 'Inactive' : 'Active'}
                  </Badge>
                  <span className="text-xs text-gray-400 font-mono">ID: {campaign.uniqueCode || 'N/A'}</span>
                </div>
                <CardTitle className="line-clamp-1 text-lg">{campaign.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {campaign.campaignMessage || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{format(new Date(campaign.startDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{campaign.quantity || 0} Slots</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                   <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Points Distributed</span>
                      <span className="font-semibold">{campaign.totalMatchingPointsEarned || 0}</span>
                   </div>
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 mt-auto"
                  onClick={() => handleAwardClick(campaign)}
                  disabled={campaign.disabled}
                >
                  <QrCode className="h-4 w-4" />
                  Award Points
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedCampaign && isAwardModalOpen && (
        <AwardPointsWrapper
          isOpen={isAwardModalOpen}
          setIsOpen={setIsAwardModalOpen}
          campaign={selectedCampaign}
        />
      )}
    </div>
  );
}

function AwardPointsWrapper({
  isOpen,
  setIsOpen,
  campaign
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  campaign: CampaignResponse;
}) {
  return (
    <AwardPointsModal
       campaignId={campaign.id}
       campaignName={campaign.name}
       // We added these props to AwardPointsModal
       externalOpen={isOpen}
       setExternalOpen={setIsOpen}
       rewardMode="points" // Matching points are points
       canAwardPoints={true}
       canAwardStamps={false}
    />
  );
}
