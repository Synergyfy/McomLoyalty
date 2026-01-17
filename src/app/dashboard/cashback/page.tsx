'use client';

import React from 'react';
import { useGetCashbackBalance, useGetCashbackEvents } from '@/services/cashback/hook';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coins, Info, Loader2 } from 'lucide-react';

export default function CashbackPage() {
  const { data: balanceData, isLoading: isBalanceLoading } = useGetCashbackBalance();
  const { data: eventsData, isLoading: isEventsLoading } = useGetCashbackEvents();

  const isLoading = isBalanceLoading || isEventsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">Cashback Rewards</h1>
        <p className="text-muted-foreground">View your accumulated cashback and discover how to earn more.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cashback</CardTitle>
            <Coins className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">£{Number(balanceData?.balance || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Redeemable towards future purchases or services.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earning Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            How to Earn Cashback
          </CardTitle>
          <CardDescription>
            You can earn cashback rewards by performing the following actions on our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventsData && eventsData.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventsData.map((event) => (
                <div
                  key={event}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex items-start gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1 bg-blue-100 p-2 rounded-full">
                     <Coins className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{event.replace(/_/g, ' ')}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Earn rewards when you complete this action.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No active cashback opportunities at the moment. Check back soon!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
