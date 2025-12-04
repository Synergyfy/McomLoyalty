<<<<<<< HEAD

'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { GUIDE_CONTENT } from '@/lib/guide-content';

interface GuideContextType {
    activeGuideId: string | null;
    currentStepIndex: number;
    isGuideVisible: boolean;
    startGuide: (guideId: string) => void;
    endGuide: () => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (index: number) => void;
    toggleVisibility: () => void;
=======
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetBusinessProfile } from '@/services/business/hook';
import { useGetBusinessRewards } from '@/services/business-reward/hooks';
import { useGetMyCreatedCampaigns } from '@/services/campaigns/hook';
import { useGetAllStaff } from '@/services/staff/hook';
import { GuideStep } from '@/lib/guide-content';

interface GuideContextType {
  currentStep: GuideStep;
  isLoading: boolean;
  refreshGuide: () => void;
>>>>>>> 94f632025b569a210ba0ec32f6615fdfeaf4c930
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

<<<<<<< HEAD
export const GuideProvider = ({ children }: { children: ReactNode }) => {
    const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    // Load state from localStorage on mount (for persistence across navigations)
    useEffect(() => {
        const savedGuideId = localStorage.getItem('mcom_active_guide_id');
        const savedStepIndex = localStorage.getItem('mcom_guide_step_index');
        const savedVisibility = localStorage.getItem('mcom_guide_visible');

        if (savedGuideId) {
            setActiveGuideId(savedGuideId);
            setIsGuideVisible(savedVisibility === 'true');
            if (savedStepIndex) {
                setCurrentStepIndex(parseInt(savedStepIndex, 10));
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (activeGuideId) {
            localStorage.setItem('mcom_active_guide_id', activeGuideId);
            localStorage.setItem('mcom_guide_step_index', currentStepIndex.toString());
            localStorage.setItem('mcom_guide_visible', isGuideVisible.toString());
        } else {
            localStorage.removeItem('mcom_active_guide_id');
            localStorage.removeItem('mcom_guide_step_index');
            localStorage.removeItem('mcom_guide_visible');
        }
    }, [activeGuideId, currentStepIndex, isGuideVisible]);

    const startGuide = useCallback((guideId: string) => {
        if (GUIDE_CONTENT[guideId]) {
            setActiveGuideId(guideId);
            setCurrentStepIndex(0);
            setIsGuideVisible(true);
        } else {
            console.warn(`Guide with ID ${guideId} not found.`);
        }
    }, []);

    const endGuide = useCallback(() => {
        setActiveGuideId(null);
        setCurrentStepIndex(0);
        setIsGuideVisible(false);
    }, []);

    const nextStep = useCallback(() => {
        if (activeGuideId) {
            const steps = GUIDE_CONTENT[activeGuideId];
            if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
            } else {
                // Optionally end guide or stay on last step
                // endGuide();
            }
        }
    }, [activeGuideId, currentStepIndex]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    const goToStep = useCallback((index: number) => {
        if (activeGuideId) {
            const steps = GUIDE_CONTENT[activeGuideId];
            if (index >= 0 && index < steps.length) {
                setCurrentStepIndex(index);
            }
        }
    }, [activeGuideId]);

    const toggleVisibility = useCallback(() => {
        setIsGuideVisible(prev => !prev);
    }, []);

    return (
        <GuideContext.Provider value={{
            activeGuideId,
            currentStepIndex,
            isGuideVisible,
            startGuide,
            endGuide,
            nextStep,
            prevStep,
            goToStep,
            toggleVisibility
        }}>
            {children}
        </GuideContext.Provider>
    );
};

export const useGuide = () => {
    const context = useContext(GuideContext);
    if (context === undefined) {
        throw new Error('useGuide must be used within a GuideProvider');
    }
    return context;
=======
export const GuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<GuideStep>('PROFILE');

  // Fetch data to determine step
  // 1. Profile
  const { data: profile, isLoading: loadingProfile, refetch: refetchProfile } = useGetBusinessProfile();

  // 2. Rewards (Check if any exist)
  const { data: rewards, isLoading: loadingRewards, refetch: refetchRewards } = useGetBusinessRewards(1, 1);

  // 3. Campaigns (Check if any created)
  const { data: campaigns, isLoading: loadingCampaigns, refetch: refetchCampaigns } = useGetMyCreatedCampaigns(1, 1);

  // 4. Staff (Check if any exist)
  const { data: staff, isLoading: loadingStaff, refetch: refetchStaff } = useGetAllStaff();

  const isLoading = loadingProfile || loadingRewards || loadingCampaigns || loadingStaff;

  useEffect(() => {
    if (isLoading) return;

    if (!profile) {
      // If profile fails to load, maybe default to PROFILE or handle error
      setCurrentStep('PROFILE');
      return;
    }

    // Check Profile Completion
    // We consider it incomplete if address or phone is missing, or if the name is just default?
    // Let's assume critical fields: address, phone.
    const isProfileComplete = !!(profile.address && profile.phone);

    if (!isProfileComplete) {
      setCurrentStep('PROFILE');
      return;
    }

    // Check Rewards
    const hasRewards = rewards?.total ? rewards.total > 0 : false;
    if (!hasRewards) {
      setCurrentStep('REWARD');
      return;
    }

    // Check Campaigns
    const hasCampaigns = campaigns?.total ? campaigns.total > 0 : false;
    if (!hasCampaigns) {
      setCurrentStep('CAMPAIGN');
      return;
    }

    // Check Staff
    // The staff API returns an array directly in .data usually, but let's check the type.
    // PaginatedStaffResponse: { data: Staff[], total: number, ... }
    const hasStaff = staff?.length ? staff.length > 0 : false;
    // Wait, useGetAllStaff select: (data) => data.data. So `staff` is Staff[].
    // Let's re-verify the hook return type.

    if (!hasStaff) {
      setCurrentStep('STAFF');
      return;
    }

    setCurrentStep('COMPLETED');

  }, [profile, rewards, campaigns, staff, isLoading]);

  const refreshGuide = () => {
    refetchProfile();
    refetchRewards();
    refetchCampaigns();
    refetchStaff();
  };

  return (
    <GuideContext.Provider value={{ currentStep, isLoading, refreshGuide }}>
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
>>>>>>> 94f632025b569a210ba0ec32f6615fdfeaf4c930
};
