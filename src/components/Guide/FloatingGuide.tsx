<<<<<<< HEAD

=======
>>>>>>> 94f632025b569a210ba0ec32f6615fdfeaf4c930
'use client';

import React from 'react';
import { useGuide } from '@/context/GuideContext';
import { GUIDE_CONTENT } from '@/lib/guide-content';
<<<<<<< HEAD
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export default function FloatingGuide() {
    const {
        activeGuideId,
        currentStepIndex,
        isGuideVisible,
        nextStep,
        prevStep,
        endGuide,
        toggleVisibility
    } = useGuide();

    if (!activeGuideId || !GUIDE_CONTENT[activeGuideId]) {
        return null;
    }

    const steps = GUIDE_CONTENT[activeGuideId];
    const currentStep = steps[currentStepIndex];

    if (!isGuideVisible) {
        return (
            <div className="fixed bottom-6 right-6 z-[9999]">
                <Button
                    onClick={toggleVisibility}
                    className="rounded-full h-12 w-12 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <HelpCircle className="h-6 w-6" />
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-[9999] w-80 md:w-96 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
            <Card className="border-blue-200 border-2">
                <CardHeader className="bg-blue-50 pb-3 relative">
                    <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                            {currentStepIndex + 1}
                        </span>
                        {currentStep.title}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-gray-700"
                        onClick={toggleVisibility}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {currentStep.description}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3 bg-gray-50/50">
                    <div className="text-xs text-gray-400 font-medium">
                        Step {currentStepIndex + 1} of {steps.length}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevStep}
                            disabled={currentStepIndex === 0}
                            className="h-8 px-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {currentStepIndex < steps.length - 1 ? (
                            <Button
                                size="sm"
                                onClick={nextStep}
                                className="h-8 bg-blue-600 hover:bg-blue-700"
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="default"
                                onClick={endGuide}
                                className="h-8 bg-green-600 hover:bg-green-700"
                            >
                                Finish
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
=======
import { X } from 'lucide-react';

export const FloatingGuide = () => {
  const { currentStep, isLoading } = useGuide();
  const [isVisible, setIsVisible] = React.useState(true);

  if (isLoading || !isVisible || currentStep === 'COMPLETED') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-orange-100 rounded-xl shadow-xl p-5 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-orange-600 font-bold text-lg flex items-center gap-2">
          <span className="bg-orange-100 p-1 rounded-md text-orange-600 text-xs uppercase tracking-wide">Guide</span>
          Setup Assistant
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close guide"
        >
          <X size={18} />
        </button>
      </div>

      <p className="text-gray-700 leading-relaxed text-sm">
        {GUIDE_CONTENT[currentStep]}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-1">
          {(['PROFILE', 'REWARD', 'CAMPAIGN', 'STAFF'] as const).map((step) => (
             <div
               key={step}
               className={`h-1.5 w-6 rounded-full ${
                 currentStep === step ? 'bg-orange-500' :
                 // If the step is "before" the current step, it's done (green/gray).
                 // Simple logic: checking index in array
                 (['PROFILE', 'REWARD', 'CAMPAIGN', 'STAFF'].indexOf(step) < ['PROFILE', 'REWARD', 'CAMPAIGN', 'STAFF'].indexOf(currentStep))
                 ? 'bg-green-400'
                 : 'bg-gray-200'
               }`}
             />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Step {['PROFILE', 'REWARD', 'CAMPAIGN', 'STAFF'].indexOf(currentStep) + 1} of 4
        </span>
      </div>
    </div>
  );
};
>>>>>>> 94f632025b569a210ba0ec32f6615fdfeaf4c930
