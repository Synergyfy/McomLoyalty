"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Star, Wallet } from "lucide-react";
import { useGetStampRewardStats } from "@/services/business-stamp-rewards/hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceModalProps {
  summary: {
    earned: number;
    spent: number;
    matchingAvailable: number;
  };
  isTrial?: boolean;
  trialQuota?: number;
}

export const BalanceModal = ({ summary, isTrial, trialQuota }: BalanceModalProps) => {
  const { data: stampStats } = useGetStampRewardStats();

  // Trial View Logic
  const renderTrialView = () => {
    const remaining = (trialQuota || 0) - summary.spent;
    const isExhausted = remaining <= 0;

    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
            Trial Limit Active
          </div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            Trial Points
            {isExhausted && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">Exhausted</span>}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Allocated</p>
              <p className="text-2xl font-bold flex items-center justify-center gap-1 text-indigo-600">
                {(trialQuota || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Used</p>
              <p className="text-2xl font-bold flex items-center justify-center gap-1 text-orange-600">
                {summary.spent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className={`text-2xl font-bold ${remaining > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {Math.max(0, remaining).toLocaleString()}
              </p>
            </div>
          </div>
          {isExhausted && (
            <div className="mt-4 text-center">
              <a href="/dashboard/subscription" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                Upgrade to continue
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Standard View Logic
  const renderStandardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm text-center">
        <p className="text-sm text-gray-500 mb-1">Points Earned</p>
        <p className="text-2xl font-bold flex items-center justify-center gap-1 text-green-600">
          <ArrowUp size={20} /> {summary.earned.toLocaleString()}
        </p>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm text-center">
        <p className="text-sm text-gray-500 mb-1">Points Spent</p>
        <p className="text-2xl font-bold flex items-center justify-center gap-1 text-red-600">
          <ArrowDown size={20} /> {summary.spent.toLocaleString()}
        </p>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm text-center">
        <p className="text-sm text-gray-500 mb-1">Matching Available</p>
        <p className="text-2xl font-bold text-orange-600">{summary.matchingAvailable.toLocaleString()}</p>
      </div>
      {/* Stamp Balance - Added to Standard View grid */}
      <div className="rounded-lg border bg-white p-4 shadow-sm text-center">
        <p className="text-sm text-gray-500 mb-1">Total Stamps Awarded</p>
        <p className="text-2xl font-bold flex items-center justify-center gap-1 text-blue-600">
          <Star size={20} className="text-blue-600" />
          {stampStats?.totalStampsAwarded?.toLocaleString() ?? 0}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-md border-none bg-white lg:col-span-2 cursor-pointer hover:shadow-lg transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Balances</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full">View Balance</Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Account Balances</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {isTrial ? renderTrialView() : renderStandardView()}

          {/* If Trial, we might still want to show Stamp Balance separate from the trial box */}
          {isTrial && (
             <div className="rounded-lg border bg-white p-4 shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-1">Total Stamps Awarded</p>
                <p className="text-2xl font-bold flex items-center justify-center gap-1 text-blue-600">
                  <Star size={20} className="text-blue-600" />
                  {stampStats?.totalStampsAwarded?.toLocaleString() ?? 0}
                </p>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
