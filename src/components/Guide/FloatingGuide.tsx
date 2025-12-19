'use client';

import React, { useEffect, useState } from 'react';
import { useGuide } from '@/context/GuideContext';
import { GUIDE_CONTENT, GUIDE_URLS } from '@/lib/guide-content';
import { Button } from '../ui/button';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

// Interface for backend status response
interface BusinessSetupStatus {
    hasReward: boolean;
    hasCampaign: boolean;
    hasStaff: boolean;
}

export default function FloatingGuide() {
    const {
        activeGuideId,
        currentStepIndex,
        isGuideVisible,
        startGuide,
        endGuide,
        nextStep,
        prevStep,
        toggleVisibility
    } = useGuide();
    const router = useRouter();

    // Fetch business setup status to determine which guide to suggest
    const { data: setupStatus, isLoading } = useQuery<BusinessSetupStatus>({
        queryKey: ['businessSetupStatus'],
        queryFn: async () => {
            const res = await api.get('/business/setup/status');
            return res.data;
        },
        retry: false, // Don't retry on error (e.g. 401 if not logged in or 403)
    });

    // Automatically start relevant guide based on status
    useEffect(() => {
        if (!isLoading && setupStatus && !activeGuideId) {
            // Priority: Reward -> Campaign -> Staff
            // We can add logic here to auto-open if desired, but user feedback suggests relying on manual trigger or subtle suggestion.
        }
    }, [isLoading, setupStatus, activeGuideId, startGuide]);


    // Determine the "Next Recommended Step" to display when minimized
    const getRecommendedGuideId = () => {
        if (!setupStatus) return null;
        if (!setupStatus.hasReward) return 'REWARD';
        if (!setupStatus.hasCampaign) return 'CAMPAIGN';
        if (!setupStatus.hasStaff) return 'STAFF';
        return null; // All done?
    };

    const recommendedGuideId = getRecommendedGuideId();

    const handleStartRecommended = () => {
        if (recommendedGuideId) {
            startGuide(recommendedGuideId);
            // Also navigate to the starting page
            const url = GUIDE_URLS[recommendedGuideId];
            if (url) router.push(url);
        }
    };

    if (isLoading) return null; // Or return a small skeleton

    // If all steps are complete, maybe don't show the floating button?
    // Or show a "Help" button.
    if (!recommendedGuideId && !activeGuideId) {
         return null;
    }

    const currentGuideSteps = activeGuideId ? GUIDE_CONTENT[activeGuideId] : [];
    const currentStep = currentGuideSteps[currentStepIndex];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isGuideVisible && activeGuideId && currentStep && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-4 w-80 mb-2"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                {currentStep.title}
                            </h3>
                            <button onClick={toggleVisibility} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            {currentStep.description}
                        </p>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-400">
                                Step {currentStepIndex + 1} of {currentGuideSteps.length}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={prevStep}
                                    disabled={currentStepIndex === 0}
                                    className="h-7 px-2"
                                >
                                    <ChevronLeft className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (currentStepIndex === currentGuideSteps.length - 1) {
                                            endGuide();
                                        } else {
                                            nextStep();
                                            // Optional: Navigate if the next step requires it?
                                            // The content might need to specify a URL for each step if we want deep linking per step.
                                        }
                                    }}
                                    className="h-7 px-2 text-xs"
                                >
                                    {currentStepIndex === currentGuideSteps.length - 1 ? 'Finish' : 'Next'}
                                    {currentStepIndex !== currentGuideSteps.length - 1 && <ChevronRight className="w-3 h-3 ml-1" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    if (activeGuideId) {
                        toggleVisibility();
                    } else {
                        handleStartRecommended();
                    }
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
            >
                {isGuideVisible ? (
                    <X className="w-6 h-6" />
                ) : (
                    <HelpCircle className="w-6 h-6" />
                )}
            </motion.button>

            {/* Label for the button if no guide is active, suggesting the next step */}
            {!activeGuideId && recommendedGuideId && (
                <div className="absolute right-14 top-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    Next: {GUIDE_CONTENT[recommendedGuideId][0].title}
                </div>
            )}
        </div>
    );
}
