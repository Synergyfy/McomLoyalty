
'use client';

import React, { useMemo } from 'react';
import CampaignPreview from '@/components/dashboard/campaigns/previews/CampaignPreview';
import { useParams } from 'next/navigation';
import { useGetClaimableCampaigns } from '@/services/campaigns/hook';
import { PublicCampaignResponse } from '@/services/campaigns/types';

export default function CampaignPreviewPage() {
  const params = useParams();
  const { campaignId } = params;

  // Fetch claimable campaigns to find the current one. 
  // Ideally there should be a getSingleCampaign endpoint.
  const { data: claimableCampaignsData, isLoading } = useGetClaimableCampaigns(1, 100);

  const campaign = useMemo(() => {
    const campaignData = claimableCampaignsData?.data.find(c => c.id === campaignId);
    if (!campaignData) {
      return null;
    }
    // Map the snake_case properties to camelCase
    return {
      id: campaignData.id,
      name: campaignData.name,
      campaignType: campaignData.campaign_type,
      campaignMessage: campaignData.campaign_message,
      startDate: campaignData.start_date,
      endDate: campaignData.end_date,
      quantity: campaignData.quantity,
      audienceType: campaignData.audience_type,
      bannerUrl: campaignData.banner_url,
      logoUrl: campaignData.logo_url,
      ctaText: campaignData.cta_text,
      ctaBackgroundColor: campaignData.cta_background_color,
      ctaTextColor: campaignData.cta_text_color,
      textColor: campaignData.text_color,
      backgroundColor: campaignData.background_color,
      disabled: campaignData.disabled,
      rewards: campaignData.rewards.map(reward => ({
        id: reward.id,
        title: reward.title,
        pointsRequired: reward.points_required,
        value: reward.value,
        description: reward.description,
        image: reward.image,
        quantity: reward.quantity,
      })),
    };
  }, [claimableCampaignsData, campaignId]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading campaign details...</div>;
  }

  if (!campaign) {
    return <div className="p-8 text-center">Campaign not found or not claimable.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CampaignPreview campaign={campaign} />
    </div>
  );
}
