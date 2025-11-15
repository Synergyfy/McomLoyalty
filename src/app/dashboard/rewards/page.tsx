'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useGetBusinessRewards } from '@/services/business-reward/hooks';
import { BusinessReward } from '@/services/business-reward/types';

export default function BusinessRewardsPage() {
  const {
    data: rewardsData,
    isLoading,
    isError,
  } = useGetBusinessRewards(1, 10);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching rewards</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Added Rewards
            </h1>
            <p className="text-gray-600">
              These are the rewards you have added to your business from the
              admin.
            </p>
          </div>
          <Button> Add Reward</Button>
        </div>

        {rewardsData?.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No rewards found. Add a reward to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardsData?.data.map((businessReward: BusinessReward) => (
              <Card
                key={businessReward.id}
                className="flex flex-col hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                        {businessReward.reward.image && (
                          <Image
                            src={businessReward.reward.image}
                            alt={businessReward.reward.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {businessReward.reward.title}
                        </CardTitle>
                        <Badge
                          variant={
                            !businessReward.reward.disabled
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {!businessReward.reward.disabled
                            ? 'Active'
                            : 'Expired'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600 mb-3">
                    {businessReward.reward.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Value:</span>
                      <span>£{businessReward.reward.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Points:</span>
                      <span>{businessReward.point_cost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
