'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetBusinessRewards, useAddRewardToBusiness } from '@/services/rewards/hook';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function BusinessRewardsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data: rewardsData, isLoading: isLoadingRewards } = useGetBusinessRewards(
    page,
    limit
  );
  const { mutate: addReward, isPending: isAddingReward } = useAddRewardToBusiness();
  const [quantity, setQuantity] = useState(100);

  const handleAddReward = (rewardId: string) => {
    addReward({ rewardId, quantity }, {
      onSuccess: () => {
        alert('Reward added successfully!');
      },
      onError: (error) => {
        alert(`Error adding reward: ${error.message}`);
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-primary">Business Rewards</h1>
      <p className="mb-5">Manage your business rewards.</p>

      <h2 className="text-xl font-bold mb-5">All Rewards</h2>

      {isLoadingRewards ? (
        <p>Loading rewards...</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Points Required</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewardsData?.rewards && rewardsData.rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>{reward.title}</TableCell>
                  <TableCell>{reward.points_required}</TableCell>
                  <TableCell>{reward.value}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleAddReward(reward.id)}
                      disabled={isAddingReward}
                    >
                      {isAddingReward ? 'Adding...' : 'Add Reward'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center p-4">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {rewardsData?.currentPage} of {rewardsData?.totalPages}
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === rewardsData?.totalPages}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
