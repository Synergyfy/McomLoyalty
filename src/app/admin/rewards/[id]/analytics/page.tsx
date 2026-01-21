'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetRewardById } from '@/services/rewards/hook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Trophy, Award, Stamp } from 'lucide-react';
import LoadingSpinner from '@/components/ui/Loading';

export default function RewardAnalyticsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const { data: reward, isLoading, isError } = useGetRewardById(id as string);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !reward) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center items-center">
                <p className="text-lg text-gray-500 mb-4">Reward analytics not found.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reward Analytics</h1>
                        <p className="text-gray-500 mt-1">{reward.title}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Businesses Claimed</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reward.businessClaimedCount || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reward.totalRedemptionsCount || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {(reward.totalPointsRedeemed || 0).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stamps Redeemed</CardTitle>
                            <Stamp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reward.totalStampsRedeemed || 0}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
