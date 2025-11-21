'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCampaignMembership } from '@/context/CampaignMembershipContext';
import { SignUpDialog } from '@/components/customer/SignUpDialog';
import { useRouter } from 'next/navigation';

const pointBalance = 1250;

const transactionHistory = [
  {
    id: '1',
    action: 'Earned Points',
    details: 'Purchase at Mcom Store',
    points: '+',
    date: '2025-10-28',
  },
  {
    id: '2',
    action: 'Redeemed Reward',
    details: 'Free Coffee',
    points: '-',
    date: '2025-10-25',
  },
  {
    id: '3',
    action: 'Earned Points',
    details: 'Completed a survey',
    points: '+',
    date: '2025-10-22',
  },
  {
    id: '4',
    action: 'Earned Points',
    details: 'Referred a friend',
    points: '+',
    date: '2025-10-19',
  },
];

import { useParams } from 'next/navigation';
import { useGetPublicCampaignDetail } from '@/services/campaigns/hook';
import LoadingSpinner from '@/components/ui/Loading';

export default function MyPointsPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;
  const { data: campaign, isLoading, isError, refetch } = useGetPublicCampaignDetail(campaignId);

  const { isMember } = useCampaignMembership();
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isMember) {
      setIsSignUpDialogOpen(true);
    }
  }, [isMember]);

  const handleDialogClose = () => {
    setIsSignUpDialogOpen(false);
    if (!isMember) {
      router.push(`/campaigns/${campaignId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 px-4 bg-gray-50">
        <p className="text-red-500 font-medium">Error loading points info.</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // TypeScript now knows campaign is non-null after the early return
  const campaignName = campaign.name || 'the Campaign';

  if (!isMember) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-lg text-gray-600">You need to join a campaign to view your points.</p>
        </div>
        <SignUpDialog
          isOpen={isSignUpDialogOpen}
          onClose={handleDialogClose}
          campaignTitle={campaignName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="balance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="balance">
            <Card>
              <CardHeader>
                <CardTitle>Your Current Balance</CardTitle>
                <CardDescription>
                  This is the total number of points you have available to spend.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-6xl font-bold text-orange-600">{pointBalance}</p>
                <p className="text-2xl text-gray-600">Points</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  A record of your points earned and spent.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.action}</TableCell>
                        <TableCell>{transaction.details}</TableCell>
                        <TableCell className={`text-right font-bold ${transaction.points.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.points}
                        </TableCell>
                        <TableCell className="text-right">{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
