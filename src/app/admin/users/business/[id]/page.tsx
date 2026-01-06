'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useAdminBusinessById,
} from '@/services/admin/hook';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Users, Gift, Megaphone, Flame, Percent, Plus, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import BusinessSidebar from '@/components/dashboard/sidebar/index';
import BusinessHeader from '@/components/dashboard/header';

import { Subscription } from '@/services/tiers/types';
import { useGetGeneralAnalytics, useGetChartData } from "@/services/business-dashboard/hook";
import { useGetMySubscription } from '@/services/tiers/hook';
import { StatCard, TierProgress, PointsSummary } from "@/components/dashboard/shared/DashboardWidgets";

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

type TimeRange = "7d" | "30d" | "3m" | "6m" | "1y";

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last Year" },
];

export default function AdminBusinessImpersonationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  // Admin-specific hook to fetch business details (for the header/sidebar context)
  const { data: businessDetails, isLoading: isDetailsLoading, error: detailsError } = useAdminBusinessById(id);

  // Business Dashboard hooks (with businessId param)
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetGeneralAnalytics(id);
  const { data: chartData, isLoading: isChartLoading, isError: isChartError } = useGetChartData({ period: timeRange, businessId: id });
  const { data: subscription, isLoading: isLoadingSubscription } = useGetMySubscription(id);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isLoading = isDetailsLoading || isAnalyticsLoading || isLoadingSubscription;
  const isError = detailsError;

  if (isError || (!isLoading && !businessDetails)) {
      return (
          <div className="p-8">
              <div className="text-red-500 mb-4">Error loading business data or business user not found.</div>
              <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Business List
              </Button>
          </div>
      );
  }

  // Fallback data while loading to prevent crashes if we render partial content
  const impersonatedProfile: BusinessProfileType = businessDetails ? {
      id: businessDetails.id,
      name: businessDetails.name,
      email: businessDetails.email,
      role: businessDetails.role || 'business',
      // The API response might have snake_case or camelCase depending on the endpoint,
      // but AdminBusinessDetails doesn't explicitly list profileImage.
      // We can try to map it if available, or leave it undefined.
  } : { id: '', name: 'Loading...', email: '', role: 'business' };

  // Use the fetched subscription or fallback
  const impersonatedSubscription: Partial<Subscription> = subscription || {
      tier: { name: 'Loading...' } as any
  };

  const impersonatedMonthlyBalance: MonthlyBalanceType = {
      remaining: businessDetails?.remainingPointBalance,
      monthlyLimit: undefined, // Admin details might not have this, but subscription might
      used: businessDetails?.total_points_redeemed,
  };

  const selectedTimeRangeLabel = timeRangeOptions.find(option => option.value === timeRange)?.label;
  const tierName = subscription?.tier?.name || 'N/A';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tierProgress = (subscription?.tier as any)?.progress || 0;

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
                            <p className="text-sm text-yellow-700">You are viewing the dashboard as <span className="font-semibold">{businessDetails?.name}</span>.</p>
                         </div>
                         <Button variant="outline" onClick={() => router.push('/admin/users/business')} className="bg-white hover:bg-gray-50 border-yellow-400 text-yellow-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Exit User View
                         </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex h-96 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* === Overview Stats === */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                <StatCard title="Total Customers" value={analyticsData?.totalCustomers ?? 0} icon={<Users className="text-orange-500" />} />
                                <StatCard title="Rewards Redeemed" value={analyticsData?.totalRewardsRedeemed ?? 0} icon={<Gift className="text-orange-500" />} />
                                <StatCard title="Total Campaigns" value={analyticsData?.totalCampaigns ?? 0} icon={<Megaphone className="text-orange-500" />} />
                                <StatCard title="Total Active Campaigns" value={analyticsData?.totalActiveCampaigns ?? 0} icon={<Flame className="text-orange-500" />} />
                                <StatCard title="Points Redeemed" value={analyticsData?.totalPointsRedeemed ?? 0} icon={<Percent className="text-orange-500" />} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <TierProgress tier={{ name: tierName, progress: tierProgress }} />
                                <PointsSummary
                                summary={{ earned: analyticsData?.totalPointsEarned ?? 0, spent: analyticsData?.totalPointsRedeemed ?? 0, matchingAvailable: 5000 }}
                                isTrial={subscription?.isTrial}
                                trialQuota={subscription?.tier?.configuration?.quotas?.monthlyPointsAllowance}
                                />
                            </div>

                            {/* === Chart Section === */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Performance ({selectedTimeRangeLabel})</CardTitle>
                                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                                    <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select time range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {timeRangeOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                </CardHeader>
                                <CardContent>
                                {isChartLoading ? (
                                    <div className="flex h-[300px] items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                                    </div>
                                ) : isChartError ? (
                                    <p className="text-red-500">Error loading chart data.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData?.data}>
                                        <XAxis dataKey="date" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            borderRadius: "8px",
                                            border: "1px solid #f97316",
                                        }}
                                        cursor={{ fill: "#fff7ed" }}
                                        />
                                        <Legend />
                                        <Bar dataKey="pointsEarned" name="Points Earned" fill="#f97316" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="pointsRedeemed" name="Points Redeemed" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                    </ResponsiveContainer>
                                )}
                                </CardContent>
                            </Card>

                            {/* === Active Campaigns === */}
                            <Card>
                                <CardHeader>
                                <CardTitle>Active Campaigns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                {analyticsData?.activeCampaigns && analyticsData.activeCampaigns.length > 0 ? (
                                    <ul className="space-y-3">
                                    {analyticsData.activeCampaigns.map((c, i) => (
                                        <li key={i} className="flex justify-between items-center border-b pb-2">
                                        <span className="font-medium text-gray-800">{c.name}</span>
                                        <span className="text-sm text-orange-600">{c.customerCount} customers</span>
                                        </li>
                                    ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No active campaigns.</p>
                                )}
                                </CardContent>
                            </Card>

                            {/* === Recent Activity === */}
                            <Card>
                                <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                {analyticsData?.lastTenActivities && analyticsData.lastTenActivities.length > 0 ? (
                                    <ul className="space-y-4">
                                    {analyticsData.lastTenActivities.map((a) => (
                                        <li key={a.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{a.participant?.name || "Unknown User"}</span>
                                            <span className="text-xs text-gray-500">{a.participant?.email}</span>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className={`flex items-center gap-1 font-bold ${a.type === 'EARN' ? 'text-green-600' : 'text-red-600'}`}>
                                            {a.type === 'EARN' ? <Plus size={14} strokeWidth={3} /> : <Minus size={14} strokeWidth={3} />}
                                            {a.points}
                                            </div>
                                            <div className="text-right">
                                            <span className="text-xs font-semibold text-gray-700 uppercase mr-1">{a.type}</span>
                                            <span className="text-xs text-gray-500">- {a.description}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        </li>
                                    ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No recent activity.</p>
                                )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </div>
    </div>
  );
}
