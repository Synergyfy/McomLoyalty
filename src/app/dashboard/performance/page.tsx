"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/services/api";
import { toast } from "sonner";

interface CampaignPerformance {
  name: string;
  stats: {
    totalCustomers: number;
    totalPointsAwarded: number;
    totalRewardsRedeemed: number;
    redemptionRate: number;
  };
  trend: { date: string; signups: number; redemptions: number; pointsAwarded: number }[];
  rewardsPerformance: {
    rewardId: string;
    title: string;
    pointsRequired: number;
    redeemed: number;
  }[];
  topCustomers: {
    name: string;
    email: string;
    points: number;
    redemptions: number;
  }[];
}

export default function CampaignPerformancePage() {
//   const { id } = useParams();
  const [data, setData] = useState<CampaignPerformance | null>(null);
  const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("7"); // default 7 days
    const id = "123";


useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}/performance`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load campaign performance");
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [id, range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading performance data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">No performance data available.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
          <p className="text-gray-500 text-sm">Campaign Performance Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={(v) => setRange(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={data.stats.totalCustomers} />
        <StatCard title="Total Points Awarded" value={data.stats.totalPointsAwarded.toLocaleString()} />
        <StatCard title="Rewards Redeemed" value={data.stats.totalRewardsRedeemed} />
        <StatCard title="Redemption Rate" value={`${data.stats.redemptionRate}%`} />
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Performance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="signups" stroke="#FF6B00" name="Signups" />
              <Line type="monotone" dataKey="redemptions" stroke="#0088FE" name="Redemptions" />
              <Line type="monotone" dataKey="pointsAwarded" stroke="#00C49F" name="Points" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Top Customers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Points</th>
                  <th className="p-2 text-left">Redemptions</th>
                </tr>
              </thead>
              <tbody>
                {data.topCustomers.map((c, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.points}</td>
                    <td className="p-2">{c.redemptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reward Performance */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Reward Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Reward</th>
                  <th className="p-2 text-left">Points</th>
                  <th className="p-2 text-left">Redeemed</th>
                </tr>
              </thead>
              <tbody>
                {data.rewardsPerformance.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">{r.pointsRequired}</td>
                    <td className="p-2">{r.redeemed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
      </CardContent>
    </Card>
  );
}
