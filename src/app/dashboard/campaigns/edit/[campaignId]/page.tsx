'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { CampaignFormProvider, useCampaignForm } from '@/context/CampaignFormContext';
import { useGetCampaignById } from '@/services/campaigns/hook';
import { Loader2 } from 'lucide-react';

import StepChooseCampaignType from '@/components/dashboard/campaigns/StepChooseCampaignType';
import StepSetCampaignDetails from '@/components/dashboard/campaigns/StepSetCampaignDetails';
import StepConfigureEarnPoints from '@/components/dashboard/campaigns/StepConfigureEarnPoints';
import StepConfigureRedeemPoints from '@/components/dashboard/campaigns/StepConfigureRedeemPoints';
import StepConfigureContactUs from '@/components/dashboard/campaigns/StepConfigureContactUs';
import StepConfigureFooter from '@/components/dashboard/campaigns/StepConfigureFooter';
import StepAddDistributionChannels from '@/components/dashboard/campaigns/StepAddDistributionChannels';
import StepCampaignScheduling from '@/components/dashboard/campaigns/StepCampaignScheduling';
import StepReviewAndCreate from '@/components/dashboard/campaigns/StepReviewAndCreate';

function EditCampaignContent() {
  const params = useParams();
  const campaignId = params.campaignId as string;
  const { updateFormData } = useCampaignForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const totalSteps = 9;

  const { data: campaignData, isLoading, isError } = useGetCampaignById(campaignId);

  // Determine if it's a claimed campaign
  // Type assertion or checking for property existence because useGetCampaignById returns CampaignResponse (camelCase)
  // but API might return BusinessCampaign (snake_case) structure as per new docs.
  const campaign = campaignData as any;
  const isClaimed = !!(campaign?.campaign);

  useEffect(() => {
    if (campaign && !dataLoaded) {
      const reverseCampaignTypeMap: Record<string, string> = {
        'qr_code': 'QR Code',
        'referral': 'Referral',
        'social_or_email': 'Social / Email',
        'special_occasion': 'Special Occasion'
      };

      const reverseAudienceTypeMap: Record<string, string> = {
        'members': 'members',
        'badge_level': 'badge_level',
        'target_wishlist': 'wishlist_target'
      };

      // Handle snake_case vs camelCase
      const campaignType = campaign.campaign_type || campaign.campaignType || '';
      const audienceTypeStr = campaign.audience_type || campaign.audienceType || '';
      const audienceTypes = audienceTypeStr
        ? audienceTypeStr.split(',').map((t: string) => reverseAudienceTypeMap[t.trim()] || t.trim())
        : [];
      
      const rewards = campaign.businessRewards || campaign.rewards || [];

      updateFormData({
        campaignName: campaign.name,
        campaignType: reverseCampaignTypeMap[campaignType] || campaignType,
        campaignMessage: campaign.campaign_message || campaign.campaignMessage,
        startDate: (campaign.start_date || campaign.startDate) ? new Date(campaign.start_date || campaign.startDate) : undefined,
        endDate: (campaign.end_date || campaign.endDate) ? new Date(campaign.end_date || campaign.endDate) : undefined,
        rewardsAvailable: campaign.quantity,
        audienceType: audienceTypes,
        imageUrl: campaign.banner_url || campaign.bannerUrl,
        logoUrl: campaign.logo_url || campaign.logoUrl,
        ctaButtonText: (campaign.cta_text || campaign.ctaText) as any,
        ctaBgColor: campaign.cta_background_color || campaign.ctaBackgroundColor,
        ctaTextColor: campaign.cta_text_color || campaign.ctaTextColor,
        bgColorTextColor: campaign.text_color || campaign.textColor,
        bgColor: campaign.background_color || campaign.backgroundColor,
        earnTitle: campaign.earn_point_page_title || campaign.earnPointPageTitle,
        earnText: campaign.earn_point_page_description || campaign.earnPointPageDescription,
        redeemTitle: campaign.redeem_reward_page_title || campaign.redeemRewardPageTitle,
        redeemText: campaign.redeem_reward_page_description || campaign.redeemRewardPageDescription,
        contactTitle: campaign.contact_us_page_title || campaign.contactUsPageTitle,
        contactText: campaign.contact_us_page_description || campaign.contactUsPageDescription,
        contactEmail: campaign.contact_email || campaign.contactEmail,
        contactPhone: campaign.contact_phone_number || campaign.contactPhoneNumber,
        footerText: campaign.footer_text || campaign.footerText,
        rewardIds: rewards.map((r: any) => r.id),
      });
      setDataLoaded(true);
    }
  }, [campaign, updateFormData, dataLoaded]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Failed to load campaign.
      </div>
    );
  }

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepChooseCampaignType onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <StepSetCampaignDetails onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepConfigureEarnPoints onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <StepConfigureRedeemPoints onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <StepConfigureContactUs onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <StepConfigureFooter onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <StepAddDistributionChannels onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <StepCampaignScheduling onNext={handleNext} onBack={handleBack} />;
      case 9:
        return <StepReviewAndCreate onBack={handleBack} campaignId={campaignId} isClaimed={isClaimed} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Campaign</h1>
        <p className="text-gray-600 mb-8">Update your loyalty campaign details.</p>

        <Progress value={(currentStep / totalSteps) * 100} className="mb-8" />

        {renderStep()}
      </div>
    </div>
  );
}

export default function EditCampaignPage() {
  return (
    <CampaignFormProvider>
      <EditCampaignContent />
    </CampaignFormProvider>
  );
}