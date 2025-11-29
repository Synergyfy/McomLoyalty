'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessUser, ConsumerUser } from '@/lib/mock-data/users';
import { Building, User, Mail, MapPin, Award, Briefcase, Activity, Calendar, DollarSign, Star, Megaphone, Tag, Users } from 'lucide-react';
import { PointsBalanceDisplay } from '@/components/customer/PointsBalanceDisplay';
import { TransactionHistoryTable } from '@/components/customer/TransactionHistoryTable';

interface ViewUserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: BusinessUser | ConsumerUser | null;
}

export function ViewUserDetailsModal({
  isOpen,
  onClose,
  user,
}: ViewUserDetailsModalProps) {
  const [historyPage, setHistoryPage] = useState(1);
  const [historyFilter, setHistoryFilter] = useState('All');

  if (!user) return null;

  const isBusinessUser = (u: BusinessUser | ConsumerUser): u is BusinessUser => {
    return 'tier' in u;
  };

  const isConsumerUser = (u: BusinessUser | ConsumerUser): u is ConsumerUser => {
    return !('tier' in u);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            {isBusinessUser(user) ? <Building className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-primary" />}
            Details for {user.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive overview of {user.name}&apos;s profile and activities.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* General Information Card */}
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" /> General Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">ID:</span>
                  <span className="text-gray-700">{user.id}</span>
                </div>
                {isBusinessUser(user) ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Sector:</span>
                      <span className="text-gray-700">{user.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Member Since:</span>
                      <span className="text-gray-700">{user.memberSince.toLocaleDateString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span className="text-gray-700">{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Joined Date:</span>
                      <span className="text-gray-700">{user.joinedDate.toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {isConsumerUser(user) ? (
            // Consumer specific view using Wallet components
            <div className="space-y-6">
               <PointsBalanceDisplay
                  totalPoints={user.points}
                  matchingPoints={user.matchingPoints}
                  utilization={0} // Not available in list view
                  badgeLevel={user.badgeLevel}
                  isLoading={false}
               />
               <TransactionHistoryTable
                  transactions={[]} // Not available in list view
                  isLoading={false}
                  page={historyPage}
                  totalPages={1}
                  onPageChange={setHistoryPage}
                  activeFilter={historyFilter}
                  onFilterChange={setHistoryFilter}
                  filterCategories={['All', 'Earned', 'Spent']}
               />
               <div className="text-center text-sm text-muted-foreground italic">
                 Transaction history is not currently available in the admin view.
               </div>
            </div>
          ) : (
            <>
              {/* Status & Levels Card for Business */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-muted-foreground" /> Status & Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Tier:</span>
                      <Badge variant="outline" className="text-gray-700">{user.tier}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Activity Status:</span>
                      <Badge variant={user.activityStatus === 'Active' ? 'default' : user.activityStatus === 'Suspended' ? 'destructive' : 'secondary'}>
                        {user.activityStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Card for Business */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-muted-foreground" /> Activity Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Campaigns Created:</span>
                      <span className="text-gray-700">{user.campaignsCreated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Rewards Attached:</span>
                      <span className="text-gray-700">{user.rewardsAttached}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Points Balance:</span>
                      <span className="text-gray-700">{new Intl.NumberFormat('en-US').format(user.pointsBalance)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
