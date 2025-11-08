'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Partner } from '@/lib/mock-data/partners';
import { FeedbackDialog } from '@/components/ui/feedback-dialog';

interface AddEditPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partner; // Optional data for editing
  onSave: (partner: Partner) => void;
  onShowFeedback: (title: string, description: React.ReactNode, actionText?: string) => void;
}

export function AddEditPartnerModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  onShowFeedback,
}: AddEditPartnerModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Partner['type']>('Co-Brand');
  const [status, setStatus] = useState<Partner['status']>('active');
  const [logoPermission, setLogoPermission] = useState(false);
  const [colorsPermission, setColorsPermission] = useState(false);
  const [textLockPermission, setTextLockPermission] = useState(false);
  const [subdomain, setSubdomain] = useState('');
  const [domainRouting, setDomainRouting] = useState('');
  const [revenueSharing, setRevenueSharing] = useState('');

  // State for Feedback Dialog (local to modal for validation errors)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackDialogProps, setFeedbackDialogProps] = useState({
    title: '',
    description: '',
    actionText: 'OK',
  });

  const handleShowLocalFeedback = (title: string, description: React.ReactNode, actionText?: string) => {
    setFeedbackDialogProps({ title, description, actionText: actionText || 'OK' });
    setShowFeedbackDialog(true);
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setStatus(initialData.status);
      setLogoPermission(initialData.brandingPermissions.logo);
      setColorsPermission(initialData.brandingPermissions.colors);
      setTextLockPermission(initialData.brandingPermissions.textLock);
      setSubdomain(initialData.subdomain);
      setDomainRouting(initialData.domainRouting || '');
      setRevenueSharing(initialData.revenueSharing);
    } else {
      // Reset form for new entry
      setName('');
      setType('Co-Brand');
      setStatus('active');
      setLogoPermission(false);
      setColorsPermission(false);
      setTextLockPermission(false);
      setSubdomain('');
      setDomainRouting('');
      setRevenueSharing('');
    }
  }, [initialData]);

  const handleSave = () => {
    const errors: string[] = [];

    if (!name.trim()) {
      errors.push('Partner Name is required.');
    }
    if (!subdomain.trim()) {
      errors.push('Subdomain is required.');
    } else if (!/^[a-z0-9-]+$/.test(subdomain)) {
      errors.push('Subdomain must be lowercase alphanumeric and hyphens only.');
    }
    if (!revenueSharing.trim()) {
      errors.push('Revenue Sharing details are required.');
    }

    if (errors.length > 0) {
      handleShowLocalFeedback(
        "Validation Error",
        <ul className="list-disc pl-5">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      );
      return;
    }

    const partnerToSave: Partner = {
      id: initialData?.id || `new-partner-${Date.now()}`,
      name,
      type,
      status,
      brandingPermissions: {
        logo: logoPermission,
        colors: colorsPermission,
        textLock: textLockPermission,
      },
      subdomain,
      domainRouting: domainRouting || undefined,
      revenueSharing,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(partnerToSave);
    onClose();
  };

  const dialogTitle = initialData ? `Edit Partner: ${initialData.name}` : 'Create New Partner';
  const dialogDescription = initialData ? 'Modify the details of this partner.' : 'Enter the details for a new partner.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={type} onValueChange={(value: Partner['type']) => setType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select partner type" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="Co-Brand">Co-Brand</SelectItem>
                <SelectItem value="White-Label">White-Label</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={status} onValueChange={(value: Partner['status']) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-4 text-lg font-semibold mt-4">Branding Permissions</div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logoPermission" className="text-right">Logo</Label>
            <Switch id="logoPermission" checked={logoPermission} onCheckedChange={setLogoPermission} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="colorsPermission" className="text-right">Colors</Label>
            <Switch id="colorsPermission" checked={colorsPermission} onCheckedChange={setColorsPermission} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="textLockPermission" className="text-right">Text Lock</Label>
            <Switch id="textLockPermission" checked={textLockPermission} onCheckedChange={setTextLockPermission} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subdomain" className="text-right">Subdomain</Label>
            <Input id="subdomain" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} placeholder="e.g., partnername" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domainRouting" className="text-right">Domain Routing (Optional)</Label>
            <Input id="domainRouting" value={domainRouting} onChange={(e) => setDomainRouting(e.target.value)} placeholder="e.g., customdomain.com" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="revenueSharing" className="text-right">Revenue Sharing</Label>
            <Input id="revenueSharing" value={revenueSharing} onChange={(e) => setRevenueSharing(e.target.value)} placeholder="e.g., 10% Commission" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Partner</Button>
        </DialogFooter>
      </DialogContent>

      <FeedbackDialog
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        {...feedbackDialogProps}
      />
    </Dialog>
  );
}
