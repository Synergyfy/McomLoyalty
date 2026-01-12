'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJoinCampaignByCode } from '@/services/campaigns/hook';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface JoinCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinCampaignModal({ isOpen, onClose }: JoinCampaignModalProps) {
  const [code, setCode] = useState('');
  const { mutate: joinCampaign, isPending } = useJoinCampaignByCode();

  const handleJoin = () => {
    if (!code.trim()) {
      toast.error('Please enter a campaign ID or code');
      return;
    }

    joinCampaign(code, {
      onSuccess: () => {
        toast.success('Successfully joined the campaign!');
        onClose();
        setCode('');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to join campaign. Please check the code.');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Campaign</DialogTitle>
          <DialogDescription>
            Enter the Unique ID or Code of the campaign you wish to join.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter Campaign ID / Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleJoin} disabled={isPending || !code.trim()}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Join Campaign
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
