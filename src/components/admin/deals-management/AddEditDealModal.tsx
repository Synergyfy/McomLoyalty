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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Deal } from '@/lib/mock-data/deals';
import { initialSectors } from '@/lib/mock-data/sectors';
// import { FeedbackDialog } from '@/components/ui/feedback-dialog'; // Remove FeedbackDialog import

interface AddEditDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Deal; // Optional data for editing
  onSave: (deal: Deal) => void;
  onShowFeedback: (title: string, description: React.ReactNode, actionText?: string) => void; // New prop
}

export function AddEditDealModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  onShowFeedback, // Destructure new prop
}: AddEditDealModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<Deal['status']>('draft');
  const [sectorId, setSectorId] = useState('');
  const [visibilityRules, setVisibilityRules] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submittedByBusinessId, setSubmittedByBusinessId] = useState('');

  // Remove local FeedbackDialog state and handlers
  // const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  // const [feedbackDialogProps, setFeedbackDialogProps] = useState({
  //   title: '',
  //   description: '',
  //   actionText: 'OK',
  // });
  // const handleShowFeedback = (title: string, description: React.ReactNode, actionText?: string) => {
  //   setFeedbackDialogProps({ title, description, actionText: actionText || 'OK' });
  //   setShowFeedbackDialog(true);
  // };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setStatus(initialData.status);
      setSectorId(initialData.sectorId);
      setVisibilityRules(initialData.visibilityRules || '');
      setIsFeatured(initialData.isFeatured);
      setSubmittedByBusinessId(initialData.submittedByBusinessId || '');
    } else {
      // Reset form for new entry
      setTitle('');
      setDescription('');
      setPrice(0);
      setStatus('draft');
      setSectorId('');
      setVisibilityRules('');
      setIsFeatured(false);
      setSubmittedByBusinessId('');
    }
  }, [initialData]);

  const handleSave = () => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push('Title is required.');
    }
    if (!description.trim()) {
      errors.push('Description is required.');
    }
    if (price < 0) {
      errors.push('Price cannot be negative.');
    }
    if (!sectorId.trim()) {
      errors.push('Sector is required.');
    }

    if (errors.length > 0) {
      onShowFeedback( // Use prop for feedback
        "Validation Error",
        <ul className="list-disc pl-5">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      );
      return;
    }

    const dealToSave: Deal = {
      id: initialData?.id || `new-deal-${Date.now()}`,
      title,
      description,
      price,
      status,
      sectorId,
      visibilityRules,
      isFeatured,
      submittedByBusinessId: submittedByBusinessId || undefined,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(dealToSave);
    onClose(); // Close the modal after saving
  };

  const dialogTitle = initialData ? `Edit Deal: ${initialData.title}` : 'Create New Deal';
  const dialogDescription = initialData ? 'Modify the details of this deal.' : 'Enter the details for a new deal.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={status} onValueChange={(value: Deal['status']) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sector" className="text-right">Sector</Label>
            <Select value={sectorId} onValueChange={setSectorId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                {initialSectors.map(sector => (
                  <SelectItem key={sector.id} value={sector.id}>{sector.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="visibilityRules" className="text-right">Visibility Rules</Label>
            <Textarea id="visibilityRules" value={visibilityRules} onChange={(e) => setVisibilityRules(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isFeatured" className="text-right">Featured Deal</Label>
            <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="submittedBy" className="text-right">Submitted By (Business ID)</Label>
            <Input id="submittedBy" value={submittedByBusinessId} onChange={(e) => setSubmittedByBusinessId(e.target.value)} placeholder="Optional" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Deal</Button>
        </DialogFooter>
      </DialogContent>

      {/* Removed FeedbackDialog from here */}
    </Dialog>
  );
}