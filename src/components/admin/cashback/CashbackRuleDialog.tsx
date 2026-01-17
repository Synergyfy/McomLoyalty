'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CashbackRule, CashbackPlatform, CashbackRewardType } from '@/services/cashback/types';
import { useCreateCashbackRule, useUpdateCashbackRule } from '@/services/cashback/hook';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CashbackRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleToEdit?: CashbackRule | null;
  onSuccess: () => void;
}

export default function CashbackRuleDialog({ open, onOpenChange, ruleToEdit, onSuccess }: CashbackRuleDialogProps) {
  const isEditMode = !!ruleToEdit;
  const { mutate: createRule, isPending: isCreating } = useCreateCashbackRule();
  const { mutate: updateRule, isPending: isUpdating } = useUpdateCashbackRule();

  const [platform, setPlatform] = useState<CashbackPlatform>('MCOM_LOYALTY');
  const [eventType, setEventType] = useState<string>('');
  const [rewardType, setRewardType] = useState<CashbackRewardType>('PERCENTAGE');
  const [rewardValue, setRewardValue] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      if (ruleToEdit) {
        setPlatform(ruleToEdit.platform);
        setEventType(ruleToEdit.eventType);
        setRewardType(ruleToEdit.rewardType);
        setRewardValue(String(ruleToEdit.rewardValue));
        setIsActive(ruleToEdit.isActive);
      } else {
        // Reset for create
        setPlatform('MCOM_LOYALTY');
        setEventType('');
        setRewardType('PERCENTAGE');
        setRewardValue('');
        setIsActive(true);
      }
    }
  }, [open, ruleToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventType.trim()) {
      toast.error('Event Type is required');
      return;
    }
    const val = parseFloat(rewardValue);
    if (isNaN(val) || val < 0) {
      toast.error('Please enter a valid reward value');
      return;
    }

    if (isEditMode && ruleToEdit) {
      updateRule({
        id: ruleToEdit.id,
        rewardValue: val,
        isActive
      }, {
        onSuccess: () => {
          toast.success('Rule updated successfully');
          onOpenChange(false);
          onSuccess();
        },
        onError: (err) => {
          toast.error(`Failed to update rule: ${err.message}`);
        }
      });
    } else {
      createRule({
        platform,
        eventType: eventType.trim(),
        rewardType,
        rewardValue: val,
        isActive
      }, {
        onSuccess: () => {
          toast.success('Rule created successfully');
          onOpenChange(false);
          onSuccess();
        },
        onError: (err) => {
          toast.error(`Failed to create rule: ${err.message}`);
        }
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Cashback Rule' : 'Create Cashback Rule'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the reward value or status of this rule. Platform and Event Type cannot be changed.'
              : 'Configure a new cashback rule for specific events.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            {/* Platform */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">Platform</Label>
              <div className="col-span-3">
                <Select
                  value={platform}
                  onValueChange={(v) => setPlatform(v as CashbackPlatform)}
                  disabled={isEditMode || isPending}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCOM_LOYALTY">MCOM Loyalty</SelectItem>
                    <SelectItem value="MCOM_MALL">MCOM Mall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Event Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventType" className="text-right">Event Type</Label>
              <Input
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="e.g. MEMBERSHIP_PURCHASE"
                className="col-span-3"
                disabled={isEditMode || isPending}
              />
            </div>

            {/* Reward Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardType" className="text-right">Reward Type</Label>
              <div className="col-span-3">
                 <Select
                  value={rewardType}
                  onValueChange={(v) => setRewardType(v as CashbackRewardType)}
                  disabled={isEditMode || isPending}
                >
                  <SelectTrigger id="rewardType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reward Value */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardValue" className="text-right">Value</Label>
              <Input
                id="rewardValue"
                type="number"
                step="0.01"
                min="0"
                value={rewardValue}
                onChange={(e) => setRewardValue(e.target.value)}
                placeholder="e.g. 5"
                className="col-span-3"
                disabled={isPending}
              />
            </div>

            {/* Is Active */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Active</Label>
              <div className="col-span-3 flex items-center">
                 <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    disabled={isPending}
                 />
                 <span className="ml-2 text-sm text-muted-foreground">{isActive ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
             <Button type="submit" disabled={isPending}>
               {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isEditMode ? 'Save Changes' : 'Create Rule'}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
