'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useAdminBusinessById,
} from '@/services/admin/hook';
import { useGetMyCreatedCampaigns } from '@/services/campaigns/hook';
import { useGetBusinessRewards } from '@/services/business-reward/hooks';
import { useGetMySubscription } from '@/services/tiers/hook';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

import BusinessSidebar from '@/components/dashboard/sidebar/index';
import BusinessHeader from '@/components/dashboard/header';

import { StatCard } from '@/components/ui/StatCard';
import { Subscription } from '@/services/tiers/types';

interface BusinessProfileType {
  id: string;
  name: string;
  email: string;
  role?: string;
  profileImage?: string;
}

interface MonthlyBalanceType {
  remaining?: number;
  monthlyLimit?: number;
  used?: number;
}

interface Campaign {
  name: string;
  status: string;
  totalParticipants: number;
}

interface Reward {
  name: string;
  pointsRequired: number;
  totalRedeemed: number;
}

function ImpersonationDataTable<T>({ title, data, columns }: { title: string, data: T[], columns: { key: keyof T, label: string }[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500">No data available.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => <th key={col.key as string} className="px-4 py-2">{col.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="border-b">
                                {columns.map(col => <td key={col.key as string} className="px-4 py-2">{String(item[col.key]) ?? 'N/A'}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default function AdminBusinessImpersonationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Admin-specific hook to fetch business details
  const { data: businessDetails, isLoading: isDetailsLoading, error: detailsError } = useAdminBusinessById(id);

  // Fetch lists for impersonation (using businessId param)
  const { data: campaignsData } = useGetMyCreatedCampaigns(1, 5, id);
  const { data: rewardsData } = useGetBusinessRewards(1, 5, id);
  const { data: subscriptionData } = useGetMySubscription(id);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isLoading = isDetailsLoading;
  const isError = detailsError;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Loading Business Dashboard...</p>
      </div>
    );
  }

  if (isError || !businessDetails) {
      return (
          <div className="p-8">
              <div className="text-red-500 mb-4">Error loading business data or business user not found.</div>
              <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Business List
              </Button>
          </div>
      );
  }
  
  const impersonatedProfile: BusinessProfileType = {
      id: businessDetails.id,
      name: businessDetails.name,
      email: businessDetails.email,
      role: businessDetails.role || 'business',
      profileImage: businessDetails.profileImage || undefined,
  };

  // Ensure subscription data is correctly typed as Partial<Subscription>
  const impersonatedSubscription: Partial<Subscription> = subscriptionData || {
      tier: { name: 'N/A' } as any
  };

  // Calculate Balance: Assuming Total Earned + Extra - Redeemed = Remaining,
  // but if remainingPointBalance is missing from new API, we can calculate or default.
  // The new API JSON didn't show 'remainingPointBalance', but did show 'totalPointsEarned', 'totalPointsRedeemed', 'extraPoints'.
  // We'll calculate it if not present, or assume the type might have it (I removed it from type if it wasn't in JSON,
  // but let's check. JSON didn't have it. I'll calculate it.)
  const calculatedRemaining = (businessDetails.totalPointsEarned || 0) + (businessDetails.extraPoints || 0) - (businessDetails.totalPointsRedeemed || 0);

  const impersonatedMonthlyBalance: MonthlyBalanceType = {
      remaining: calculatedRemaining,
      monthlyLimit: undefined, // Not in business details, maybe in subscription but not mapped here yet
      used: businessDetails.totalPointsRedeemed,
  };

  const campaigns: Campaign[] = campaignsData?.data?.map(c => ({
      name: c.title,
      status: c.status || (c.disabled ? 'Disabled' : 'Active'),
      totalParticipants: 0 // This might need a separate call or mapped from something else if available
  })) || [];

  const rewards: Reward[] = rewardsData?.data?.map(r => ({
      name: r.title,
      pointsRequired: r.pointRequired,
      totalRedeemed: 0 // Not provided in list view usually
  })) || [];
  
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-100">
        <div className="relative min-h-screen md:flex">

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleSidebar}></div>
            )}

            <BusinessSidebar
                isOpen={isSidebarOpen}
                profile={impersonatedProfile}
                isLoading={isLoading}
            />

            <div className="flex-1 md:ml-64 transition-all duration-300">

                <BusinessHeader
                    onMenuClick={toggleSidebar}
                    profile={impersonatedProfile}
                    subscription={impersonatedSubscription}
                    monthlyBalance={impersonatedMonthlyBalance}
                    isLoading={isLoading}
                />

                <main className="p-4 sm:p-6 md:p-10">
                    <div className="mb-6 flex items-center justify-between p-4 rounded-lg bg-yellow-100 border border-yellow-300">
                         <div>
                            <h3 className="font-bold text-yellow-800">Impersonation Mode</h3>
                            <p className="text-sm text-yellow-700">You are viewing the dashboard as <span className="font-semibold">{businessDetails.name}</span>.</p>
                         </div>
                         <Button variant="outline" onClick={() => router.push('/admin/users/business')} className="bg-white hover:bg-gray-50 border-yellow-400 text-yellow-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Exit User View
                         </Button>
                    </div>

                    <div className="space-y-8">
                        {/* Business Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Business Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <StatCard title="Business Name" value={businessDetails.name ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Role" value={businessDetails.role ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Is Disabled" value={businessDetails.isDisabled ? 'Yes' : 'No'} isLoading={isLoading} />
                                    <StatCard title="Member Since" value={businessDetails.createdAt ? new Date(businessDetails.createdAt).toLocaleDateString() : 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Unique Code" value={businessDetails.uniqueCode ?? 'N/A'} isLoading={isLoading} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <StatCard title="Email" value={businessDetails.email ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Phone" value={businessDetails.phone ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Website" value={businessDetails.website ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Address" value={businessDetails.address ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Postal Code" value={businessDetails.postalCode ?? 'N/A'} isLoading={isLoading} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Classification */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Classification</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <StatCard title="Sector" value={businessDetails.sector?.name ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="Category" value={businessDetails.category?.name ?? 'N/A'} isLoading={isLoading} />
                                    <StatCard title="SubCategory" value={businessDetails.subCategory?.name ?? 'N/A'} isLoading={isLoading} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Points & Financials */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Points & Financials</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <StatCard title="Points Balance" value={calculatedRemaining.toString()} isLoading={isLoading} />
                                    <StatCard title="Total Points Earned" value={businessDetails.totalPointsEarned?.toString() ?? '0'} isLoading={isLoading} />
                                    <StatCard title="Total Points Redeemed" value={businessDetails.totalPointsRedeemed?.toString() ?? '0'} isLoading={isLoading} />
                                    <StatCard title="Extra Points" value={businessDetails.extraPoints?.toString() ?? '0'} isLoading={isLoading} />
                                    <StatCard title="Reputation Points" value={businessDetails.reputationPoints?.toString() ?? '0'} isLoading={isLoading} />
                                    <StatCard title="Stripe Customer ID" value={businessDetails.stripeCustomerId ?? 'N/A'} isLoading={isLoading} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Campaigns & Rewards Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Campaigns & Rewards Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <StatCard title="Campaigns Created" value={campaignsData?.total?.toString() ?? '0'} isLoading={!campaignsData} />
                                    <StatCard title="Rewards Created" value={rewardsData?.total?.toString() ?? '0'} isLoading={!rewardsData} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Referral Program */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Referral Program</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <StatCard title="Referral Capacity" value={businessDetails.referralCapacity?.toString() ?? '0'} isLoading={isLoading} />
                                    <StatCard title="Referral Points" value={businessDetails.referralPoints?.toString() ?? '0'} isLoading={isLoading} />
                                    <StatCard title="Affiliate Code" value={businessDetails.affiliateCode ?? 'N/A'} isLoading={isLoading} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        {businessDetails.socialMedia && businessDetails.socialMedia.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Media</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        {/* Assuming socialMedia is array of strings based on JSON [], adjust if objects */}
                                        {businessDetails.socialMedia.map((url: string, index: number) => (
                                            <div key={index} className="bg-gray-50 px-3 py-2 rounded border text-sm">
                                                {url}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {/* Remaining data tables */}
                        <ImpersonationDataTable
                            title="Recent Campaigns"
                            data={campaigns}
                            columns={[
                                { key: 'name', label: 'Name' },
                                { key: 'status', label: 'Status' },
                                { key: 'totalParticipants', label: 'Participants' }
                            ]}
                        />

                        <ImpersonationDataTable
                            title="Recent Rewards"
                            data={rewards}
                            columns={[
                                { key: 'name', label: 'Name' },
                                { key: 'pointsRequired', label: 'Points' },
                                { key: 'totalRedeemed', label: 'Redeemed' }
                            ]}
                        />
                    </div>
                </main>
            </div>
        </div>
    </div>
  );
}
