'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Select, { CSSObjectWithLabel } from 'react-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload';
import DateTimePicker from './datePicker';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { useCampaignForm } from '@/context/CampaignFormContext';
import { useGetBusinessRewards } from '@/services/business-reward/hooks';



interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepSetCampaignDetails({ onNext, onBack }: StepProps) {
  const { formData, updateFormData } = useCampaignForm();
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(formData.imageUrl || null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(formData.logoUrl || null);
  const dealName = searchParams.get('dealName');

  // Fetch rewards using the hook
  const { data: rewardsData, isLoading: isLoadingRewards } = useGetBusinessRewards(1, 100); // Fetching first 100 for now
  const rewards = rewardsData?.data || [];

  const rewardOptions = rewards.map(r => ({
    value: r.id,
    label: r.title
  })) || [];

  useEffect(() => {
    const from = searchParams.get('from');
    const itemName = searchParams.get('itemName');
    const wishlistId = searchParams.get('wishlistId'); // Capture wishlistId

    if (from === 'wishlist' && itemName) {
      updateFormData({
        campaignName: formData.campaignName || `${itemName} Campaign`,
        audienceType: ['wishlist_target'],
        wishlistItemIds: [itemName],
        wishlistAggregateId: wishlistId || undefined, // Store wishlist ID
      });
    } else if (dealName && !formData.campaignName) {
      updateFormData({
        campaignName: `${dealName} Campaign`,
        audienceType: ['wishlist_target'], // Assuming dealName also implies wishlist_target
        wishlistItemIds: [dealName],
      });
    }
  }, [searchParams, formData.campaignName, updateFormData, dealName]);

  useEffect(() => {
    if (formData.imageUrl) setImagePreviewUrl(formData.imageUrl);
    if (formData.logoUrl) setLogoPreviewUrl(formData.logoUrl);
  }, [formData.imageUrl, formData.logoUrl]);

  const handleFileSelect = (file: File | null, previewUrl: string | null) => {
    setImagePreviewUrl(previewUrl);
    updateFormData({ imageUrl: previewUrl || '', imageFile: file });
  };

  const handleLogoSelect = (file: File | null, previewUrl: string | null) => {
    setLogoPreviewUrl(previewUrl);
    updateFormData({ logoUrl: previewUrl || '', logoFile: file });
  };

  const handleNextClick = () => {
    const newErrors: Record<string, boolean> = {};
    const { campaignName, rewardIds, startDate, endDate, rewardsAvailable, campaignMessage, ctaButtonText, audienceType, badgeLevels, wishlistItemIds } = formData;

    if (!campaignName.trim()) newErrors.campaignName = true;
    if (rewardIds.length === 0) newErrors.rewardIds = true;
    if (!startDate) {
      newErrors.startDate = true;
    } else if (startDate < new Date()) {
      newErrors.startDate = true;
      alert("Start date cannot be in the past.");
    }
    if (!endDate) newErrors.endDate = true;
    if (!campaignMessage.trim()) newErrors.campaignMessage = true;
    if (audienceType.length === 0) newErrors.audienceType = true;
    if (audienceType.includes('badge_level') && (!badgeLevels || badgeLevels.length === 0)) newErrors.badgeLevels = true;
    if (audienceType.includes('wishlist_target') && (!wishlistItemIds || wishlistItemIds.length === 0)) newErrors.wishlistItemIds = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const selectErrorStyle = {
    control: (base: CSSObjectWithLabel) => ({ ...base, borderColor: '#ef4444', boxShadow: '0 0 0 1px #ef4444', '&:hover': { borderColor: '#ef4444' } })
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Set Campaign Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-4">
          {/* Campaign Name */}
          <div>
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Input id="campaignName" placeholder="e.g., Summer Sale Campaign" value={formData.campaignName} onChange={(e) => updateFormData({ campaignName: e.target.value })} className={errors.campaignName ? 'border-red-500' : ''} />
            <p className="text-sm text-gray-500 mt-1">The name of your campaign, as it will be displayed to customers.</p>
          </div>

          {/* Rewards to Attach */}
          <div>
            <Label htmlFor="rewardToAttach">Rewards to Attach</Label>
            <Select
              isMulti
              options={rewardOptions}
              value={rewardOptions.filter(opt => formData.rewardIds.includes(opt.value))}
              onChange={(opts) => updateFormData({ rewardIds: opts.map(o => o.value) })}
              styles={errors.rewardIds ? selectErrorStyle : {}}
              placeholder={isLoadingRewards ? "Loading rewards..." : "Select..."}
              isDisabled={isLoadingRewards}
            />
            <p className="text-sm text-gray-500 mt-1">Choose the rewards to be given out in this campaign.</p>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date & Time</Label>
              <div className={`flex items-center rounded-md border px-3 ${errors.startDate ? 'border-red-500' : ''}`}><Calendar className="mr-2 h-4 w-4 opacity-50" /><DateTimePicker date={formData.startDate} setDate={(date) => updateFormData({ startDate: date || undefined })} /></div>
              <p className="text-sm text-gray-500 mt-1">When the campaign will become active.</p>
            </div>
            <div>
              <Label>End Date & Time</Label>
              <div className={`flex items-center rounded-md border px-3 ${errors.endDate ? 'border-red-500' : ''}`}><Calendar className="mr-2 h-4 w-4 opacity-50" /><DateTimePicker date={formData.endDate} setDate={(date) => updateFormData({ endDate: date || undefined })} /></div>
              <p className="text-sm text-gray-500 mt-1">When the campaign will automatically deactivate.</p>
            </div>
          </div>

          {/* Campaign Message */}
          <div>
            <Label htmlFor="campaignMessage">Campaign Message / Caption</Label>
            <Textarea id="campaignMessage" placeholder="What customers will see..." value={formData.campaignMessage} onChange={(e) => updateFormData({ campaignMessage: e.target.value })} className={errors.campaignMessage ? 'border-red-500' : ''} />
            <p className="text-sm text-gray-500 mt-1">A catchy message to attract customers.</p>
          </div>

          {/* Image & Logo Uploads */}
          <div>
            <div className="flex items-center gap-4"><Label>Image or Banner (optional)</Label><CloudinaryUpload onFileSelect={handleFileSelect} /></div>
            <p className="text-sm text-gray-500 mt-1">Upload a banner image for your campaign. Recommended size: 1200x400 pixels (3:1 aspect ratio).</p>
            {imagePreviewUrl && <div className="mt-4"><p className="text-sm font-medium">Image Preview:</p><div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-200"><Image src={imagePreviewUrl} alt="Campaign Banner Preview" layout="fill" objectFit="cover" /></div></div>}
          </div>
          <div>
            <div className="flex items-center gap-4"><Label>Logo (optional)</Label><CloudinaryUpload onFileSelect={handleLogoSelect} /></div>
            <p className="text-sm text-gray-500 mt-1">Upload your business logo.</p>
            {logoPreviewUrl && <div className="mt-4"><p className="text-sm font-medium">Logo Preview:</p><div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200"><Image src={logoPreviewUrl} alt="Logo Preview" layout="fill" objectFit="cover" /></div></div>}
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleNextClick}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}