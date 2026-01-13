'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCampaignForm } from '@/context/CampaignFormContext';
import { useGetBusinessProfile } from '@/services/business/hook';
import { CheckCircle2 } from 'lucide-react';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepChooseCampaignType({ onNext }: StepProps) {
  const { formData, updateFormData } = useCampaignForm();
  const { data: profile, isLoading } = useGetBusinessProfile();

  const campaignTypes = [
    { value: 'qr_code', label: 'QR Code Campaign', description: 'For in-store rewards. A customer scans a code to claim or earn points.' },
    { value: 'referral', label: 'Referral Campaign', description: 'To reward users who invite friends (works with PerkZilla integration).' },
    { value: 'social_email', label: 'Social or Email Campaign', description: 'For sharing reward offers through social media or newsletters.' },
    { value: 'special_occasion', label: 'Special Occasion / Event Campaign', description: 'For birthdays, holidays, or promotions.' },
  ];

  // Add Matching Point option if Super Business
  if (profile?.isSuperBusiness) {
    // Check if it's already there to avoid duplicates if re-rendering issues occur
    const exists = campaignTypes.find(t => t.value === 'matching_point');
    if (!exists) {
        campaignTypes.push({
        value: 'matching_point',
        label: 'Matching Point Campaign',
        description: 'Create a campaign where other businesses can join and earn matching points.'
        });
    }
  }

  const handleSelectType = (type: string) => {
    updateFormData({ campaignType: type });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Choose Campaign Type</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600">Select the type of campaign you want to create:</p>

        {isLoading && <p className="text-sm text-gray-400 mb-2">Loading options...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaignTypes.map((type) => {
            const isSelected = formData.campaignType === type.value;
            return (
                <div
                key={type.value}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-between
                    ${isSelected ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' : 'hover:border-gray-400 bg-white'}`}
                onClick={() => handleSelectType(type.value)}
                >
                {isSelected && (
                    <div className="absolute top-2 right-2 text-indigo-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                )}
                <div>
                    <h4 className={`font-semibold text-lg mb-1 ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{type.label}</h4>
                    <p className={`text-sm ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>{type.description}</p>
                </div>
                </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-6">
          <Button
            onClick={onNext}
            disabled={!formData.campaignType}
            className={formData.campaignType ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
