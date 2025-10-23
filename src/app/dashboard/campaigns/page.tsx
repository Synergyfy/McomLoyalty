'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateCampaign } from '@/services/campaigns/hook';
import { CreateCampaignRequest } from '@/services/campaigns/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Stepper from '@/components/dashboard/campaigns/Stepper';
import Step1Details from '@/components/dashboard/campaigns/Step1Details';
import Step2Dates from '@/components/dashboard/campaigns/Step2Dates';
import Step3Reward from '@/components/dashboard/campaigns/Step3Reward';
import Step4Review from '@/components/dashboard/campaigns/Step4Review';
import { RewardResponse } from '@/services/rewards/types'; // Import RewardResponse

const steps = ['Details', 'Dates', 'Reward', 'Review'];

export default function CampaignsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [rewardId, setRewardId] = useState('');
  const [selectedRewardObject, setSelectedRewardObject] = useState<RewardResponse | undefined>(undefined); // New state for the full reward object
  
  const { mutate: createCampaign, isPending: isCreatingCampaign } = useCreateCampaign();

  const validateStep = () => {
    const errors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!title.trim()) errors.title = 'Campaign Title is required.';
      if (!description.trim()) errors.description = 'Campaign Description is required.';
    } else if (currentStep === 2) {
      if (!startDate) errors.startDate = 'Start Date is required.';
      if (!endDate) errors.endDate = 'End Date is required.';
      if (startDate && endDate && startDate > endDate) errors.dateRange = 'End Date cannot be before Start Date.';
    } else if (currentStep === 3) {
      if (!rewardId) errors.rewardId = 'Reward selection is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length) {
        setCompletedSteps([...completedSteps, currentStep]);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCompletedSteps(completedSteps.filter(step => step !== currentStep - 1));
      setCurrentStep(currentStep - 1);
      setValidationErrors({}); // Clear errors on back navigation
    }
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    const campaignData: CreateCampaignRequest = {
      title,
      description,
      startDate: startDate?.toISOString() || '',
      endDate: endDate?.toISOString() || '',
      rewardId,
    };
    createCampaign(campaignData, {
      onSuccess: () => {
        alert('Campaign created successfully!');
        setCurrentStep(1);
        setCompletedSteps([]);
        setTitle('');
        setDescription('');
        setStartDate(undefined);
        setEndDate(undefined);
        setRewardId('');
        setSelectedRewardObject(undefined); // Reset selected reward object
        setValidationErrors({});
      },
      onError: (error) => {
        alert(`Error creating campaign: ${error.message}`);
      },
    });
  };

  // Handler to update both rewardId and selectedRewardObject
  const handleRewardSelect = (id: string, reward: RewardResponse) => {
    setRewardId(id);
    setSelectedRewardObject(reward);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Create a New Campaign</h1>
        <p className="mt-2 text-lg text-muted-foreground">Engage your customers with exciting new offers.</p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-2xl rounded-2xl">
        <CardHeader>
          <Stepper steps={steps} currentStep={currentStep} completedSteps={completedSteps} />
        </CardHeader>
        <CardContent className="px-8 py-10">
          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <Step1Details
                title={title}
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
                error={validationErrors.title || validationErrors.description}
              />
            )}
            {currentStep === 2 && (
              <Step2Dates
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                error={validationErrors.startDate || validationErrors.endDate || validationErrors.dateRange}
              />
            )}
            {currentStep === 3 && <Step3Reward rewardId={rewardId} setRewardId={handleRewardSelect} error={validationErrors.rewardId} />}
            {currentStep === 4 && (
              <Step4Review
                title={title}
                description={description}
                startDate={startDate}
                endDate={endDate}
                reward={selectedRewardObject}
              />
            )}
            {Object.keys(validationErrors).length > 0 && (
              <div className="text-red-500 text-sm mt-4">
                Please correct the following errors:
                <ul>
                  {Object.values(validationErrors).map((msg, index) => (
                    <li key={index}>- {msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-12 border-t pt-6">
            <Button onClick={handlePrev} variant="outline" disabled={currentStep === 1}>
              Back
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isCreatingCampaign} className="bg-green-600 hover:bg-green-700">
                {isCreatingCampaign ? 'Creating...' : 'Finish & Create Campaign'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
