'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Activity,
  Award,
  Gift,
  PlusCircle,
  Search,
  Bell,
  Building,
  BarChart,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { CampaignSummaryCard } from '@/components/admin/dashboard/reports/CampaignSummaryCard';
import { TopBusinessesTable } from '@/components/admin/dashboard/reports/TopBusinessesTable';
import { PopularRewardsTable } from '@/components/admin/dashboard/reports/PopularRewardsTable';
import { PointsDistributionChart } from '@/components/admin/dashboard/reports/PointsDistributionChart';
import { ConsumerGrowthChart } from '@/components/admin/dashboard/reports/ConsumerGrowthChart';
import { BusinessTierPieChart } from '@/components/admin/dashboard/reports/BusinessTierPieChart';
import { ConversionRetentionMetrics } from '@/components/admin/dashboard/reports/ConversionRetentionMetrics';

// Mock Data based on task.md
const businessTierBreakdown = {
  starter: 20,
  active: 15,
  trusted: 5,
  partner: 2,
};

const notifications = [
  {
    id: 1,
    type: 'approval',
    message: 'New campaign "Summer Sale" from "Cafe Delight" requires approval.',
    time: '10 mins ago',
  },
  {
    id: 2,
    type: 'announcement',
    message: 'Scheduled maintenance this Sunday at 2 AM.',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'flag',
    message: 'Unusual activity detected on "Tech Gadgets" account.',
    time: '3 hours ago',
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by business, user, or campaign..." className="pl-8" />
        </div>
      </div>

      {/* Top Summary Cards */}
      <CampaignSummaryCard />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create new platform assets.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Reward
            </Button>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Sector
            </Button>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Business
            </Button>
          </CardContent>
        </Card>

        {/* Business Tier Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Business Tier Breakdown</CardTitle>
            <CardDescription>Distribution of businesses across tiers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Starter</span>
              <Badge variant="secondary">{businessTierBreakdown.starter}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Active</span>
              <Badge variant="secondary">{businessTierBreakdown.active}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Trusted</span>
              <Badge variant="secondary">{businessTierBreakdown.trusted}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Partner</span>
              <Badge variant="default">{businessTierBreakdown.partner}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent platform events and alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Businesses */}
      <div className="grid gap-6 md:grid-cols-1">
        <TopBusinessesTable />
      </div>

      {/* Most Popular Rewards */}
      <div className="grid gap-6 md:grid-cols-1">
        <PopularRewardsTable />
      </div>

      {/* Points Distributed (Standard vs Matching) */}
      <div className="grid gap-6 md:grid-cols-1">
        <PointsDistributionChart />
      </div>

      {/* Consumer Growth and Activity */}
      <div className="grid gap-6 md:grid-cols-1">
        <ConsumerGrowthChart />
      </div>

      {/* Business Tier Distribution */}
      <div className="grid gap-6 md:grid-cols-1">
        <BusinessTierPieChart />
      </div>

      {/* Conversion and Retention Reports */}
      <div className="grid gap-6 md:grid-cols-1">
        <ConversionRetentionMetrics />
      </div>
    </div>
  );
}