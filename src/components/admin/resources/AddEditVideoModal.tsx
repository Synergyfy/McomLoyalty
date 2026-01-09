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
import { FeedbackDialog } from '@/components/ui/feedback-dialog';
import { useGetTiers } from '@/services/tiers/hook';
import { Checkbox } from '@/components/ui/checkbox';
import { TrainingVideo, CreateTrainingVideoDto } from '@/services/training-videos/types';
import { useCreateTrainingVideo } from '@/services/training-videos/hook';

interface AddEditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TrainingVideo;
  onSave: (video: TrainingVideo) => void;
  onShowFeedback: (title: string, description: React.ReactNode, actionText?: string) => void;
}

export function AddEditVideoModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  onShowFeedback,
}: AddEditVideoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState<'business' | 'participant' | ''>('');
  const [selectedTierIds, setSelectedTierIds] = useState<string[]>([]);

  const { data: tiers = [] } = useGetTiers();
  const createVideoMutation = useCreateTrainingVideo();

  // State for Feedback Dialog (local to modal for validation errors)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackDialogProps, setFeedbackDialogProps] = useState<{
    title: string;
    description: React.ReactNode;
    actionText: string;
  }>({
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
      setTitle(initialData.title);
      setDescription(initialData.description);
      setVideoUrl(initialData.videoUrl);
      setTargetAudience(initialData.targetAudience);
      setSelectedTierIds(initialData.targetTierIds || []);
    } else {
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setTargetAudience('');
      setSelectedTierIds([]);
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    const errors: string[] = [];
    if (!title.trim()) errors.push('Title is required.');
    if (!videoUrl.trim()) errors.push('Video URL is required.');
    if (!targetAudience) errors.push('Target Audience is required.');

    // If business audience, allow selecting tiers, but don't force it?
    // The requirement says "when you select target audience business owners, you should also be asked to selct the particular business there are diffrent levels"
    // It says "user should be allowed to select multiple".
    // I will assume selecting at least one tier is good practice if audience is business, but maybe they want "All Tiers"?
    // If no tiers selected for business, maybe it defaults to all? Or empty?
    // Let's assume user MUST select at least one tier if "business" is selected to be safe, or I can leave it empty if the backend handles empty as "all".
    // I'll make it optional but available.

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

    const payload: CreateTrainingVideoDto = {
        title,
        description,
        video_url: videoUrl,
        target_audience: targetAudience as 'business' | 'participant',
        target_tier_ids: targetAudience === 'business' ? selectedTierIds : [],
    };

    createVideoMutation.mutate(payload, {
        onSuccess: (data) => {
            onSave(data); // Pass back to parent if needed, but parent will likely refetch
            onClose();
            onShowFeedback("Success", `Video "${title}" has been saved successfully.`);
        },
        onError: (error: any) => {
            handleShowLocalFeedback("Error", error?.response?.data?.message || "Failed to save video.");
        }
    });
  };

  const handleTierToggle = (tierId: string) => {
    setSelectedTierIds(prev =>
      prev.includes(tierId)
        ? prev.filter(id => id !== tierId)
        : [...prev, tierId]
    );
  };

  const dialogTitle = initialData ? `Edit Video: ${initialData.title}` : 'Add New Training Video';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
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
            <Label htmlFor="videoUrl" className="text-right">Video URL</Label>
            <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetAudience" className="text-right">Target Audience</Label>
            <Select value={targetAudience} onValueChange={(val) => setTargetAudience(val as 'business' | 'participant')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="business">Business Owners</SelectItem>
                <SelectItem value="participant">Consumers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {targetAudience === 'business' && (
             <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Target Tiers</Label>
                <div className="col-span-3 space-y-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                    {tiers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No tiers available.</p>
                    ) : (
                        tiers.map((tier) => (
                            <div key={tier.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`tier-${tier.id}`}
                                    checked={selectedTierIds.includes(tier.id)}
                                    onCheckedChange={() => handleTierToggle(tier.id)}
                                />
                                <Label htmlFor={`tier-${tier.id}`} className="cursor-pointer font-normal">
                                    {tier.name}
                                </Label>
                            </div>
                        ))
                    )}
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xs text-muted-foreground">Select specific business tiers (leave empty for all).</p>
                </div>
             </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={createVideoMutation.isPending}>Cancel</Button>
          <Button onClick={handleSave} disabled={createVideoMutation.isPending}>
            {createVideoMutation.isPending ? 'Saving...' : 'Save Video'}
          </Button>
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
