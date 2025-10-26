'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PointHistoryRecord } from '@/services/wallet/types';

// Mock data for all transactions
const mockAllTransactions: (PointHistoryRecord & { customer: { name: string, email: string } })[] = [
  { id: '1', timestamp: '2025-10-26T10:00:00Z', description: 'Joined Summer Bonanza', type: 'earned', points: 100, customer: { name: 'Alice Johnson', email: 'alice@example.com' }, campaign: { id: '1', title: 'Summer Bonanza' } },
  { id: '2', timestamp: '2025-10-25T14:30:00Z', description: 'Redeemed: Free Coffee', type: 'spent', points: 50, customer: { name: 'Bob Williams', email: 'bob@example.com' } },
  { id: '7', timestamp: '2025-10-25T11:00:00Z', description: 'Purchase at Burger Queen', type: 'purchase', points: 75, customer: { name: 'Alice Johnson', email: 'alice@example.com' } },
  { id: '3', timestamp: '2025-10-24T09:00:00Z', description: 'Joined Winter Wonderland', type: 'earned', points: 150, customer: { name: 'Charlie Brown', email: 'charlie@example.com' } },
  { id: '8', timestamp: '2025-10-23T20:00:00Z', description: 'Referral bonus', type: 'referral_bonus', points: 100, customer: { name: 'David Davis', email: 'david@example.com' } },
  { id: '4', timestamp: '2025-10-23T18:00:00Z', description: 'Admin bonus', type: 'manual_adjustment', points: 20, customer: { name: 'Alice Johnson', email: 'alice@example.com' } },
];

export default function PointsLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = useMemo(() => {
    return mockAllTransactions.filter(tx => {
      const matchesType = filterType === 'all' || tx.type === filterType;
      const matchesSearch = tx.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [searchTerm, filterType]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Points Transaction Log</h1>
        <p className="text-muted-foreground">A complete history of all point transactions.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex gap-4">
              <Input
                placeholder="Search by customer or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm"
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="earned">Earned</SelectItem>
                  <SelectItem value="spent">Spent</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="referral_bonus">Referral</SelectItem>
                  <SelectItem value="manual_adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="font-medium">{tx.customer.name}</div>
                    <div className="text-sm text-muted-foreground">{tx.customer.email}</div>
                  </TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>
                    <span className="capitalize bg-muted px-2 py-1 rounded-md text-xs">{tx.type.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-bold ${tx.type === 'spent' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type === 'spent' ? '-' : '+'}{tx.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
