'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle } from 'lucide-react';

interface ClaimConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignName: string;
}

export const ClaimConfirmationDialog = ({
  isOpen,
  onClose,
  campaignName,
}: ClaimConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Success!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">
            You have successfully claimed the reward for <span className="font-semibold">{campaignName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
