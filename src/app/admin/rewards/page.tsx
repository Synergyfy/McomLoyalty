'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetRewards, useDeleteReward } from '@/services/rewards/hook';
import { RewardResponse } from '@/services/rewards/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import EditRewardDialog from '@/components/admin/rewards/EditRewardDialog';
import CreateRewardDialog from '@/components/admin/rewards/CreateRewardDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';

export default function RewardsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data: rewardsData, isLoading: isLoadingRewards } = useGetRewards(page, limit);
  const { mutate: deleteReward } = useDeleteReward();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardResponse | null>(null);

  const handleEditClick = (reward: RewardResponse) => {
    setSelectedReward(reward);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (rewardId: string) => {
    deleteReward(rewardId, {
      onSuccess: () => {
        alert('Reward deleted successfully!');
      },
      onError: (error) => {
        alert(`Error deleting reward: ${error.message}`);
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Rewards</h1>
        <p className="text-muted-foreground">Create, edit, and delete rewards for your platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRewards ? (
            <p>Loading rewards...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Actions</TableHead>                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewardsData?.data && rewardsData.data.map((reward) => (
                    <TableRow key={reward.id}>
                                                              <TableCell>
                                                                <div className="relative h-10 w-10">
                                                                  <Image
                                                                    src={reward.image}
                                                                    alt={reward.title}
                                                                    layout="fill"
                                                                    className="rounded-full object-cover"
                                                                  />
                                                                </div>
                                                              </TableCell>
                                          <TableCell className="font-medium">{reward.title}</TableCell>
                                          <TableCell>{reward.pointsRequired}</TableCell>
                                          <TableCell>${reward.value}</TableCell>                      <TableCell>
                        <Button onClick={() => handleEditClick(reward)} variant="outline" size="sm" className="mr-2">Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the reward.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteClick(reward.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-center items-center mt-6 space-x-4 p-4 border-t">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {rewardsData?.currentPage} of {rewardsData?.totalPages}
                </span>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={!rewardsData || page === rewardsData.totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedReward && (
        <EditRewardDialog
          reward={selectedReward}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}

      <CreateRewardDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />

      <Button
        onClick={() => setIsCreateDialogOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg"
      >
        <Plus className="h-8 w-8" />
      </Button>
    </div>
  );
}
