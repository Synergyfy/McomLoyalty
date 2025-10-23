'use client';

import CampaignPreviewCard from './CampaignPreviewCard';
import { RewardResponse } from '@/services/rewards/types';

interface Step4ReviewProps {
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  reward?: RewardResponse; // Now receives the full reward object
}

export default function Step4Review({ title, description, startDate, endDate, reward }: Step4ReviewProps) {
  if (!reward) {
    return <p className="text-center text-red-500">Error: Reward details are missing.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Review Your Campaign</h2>
      <p className="text-muted-foreground mb-8">This is how your campaign will appear to customers.</p>
      <div className="max-w-sm mx-auto">
        <CampaignPreviewCard
          title={title}
          description={description}
          startDate={startDate}
          endDate={endDate}
          rewardTitle={reward.title}
          rewardImage={reward.image}
          rewardPoints={reward.pointsRequired}
          rewardValue={reward.value}
        />
      </div>
    </div>
  );
}
