'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParticipantSignUp } from '@/services/auth/hook';
import { toast } from 'sonner';

interface SignUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
}

export function SignUpDialog({ isOpen, onClose, campaignTitle }: SignUpDialogProps) {
  const { mutateAsync: signup, isPending } = useParticipantSignUp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await signup({
        fullName: name,
        email: email,
        password: password,
      });
      toast.success("Account created successfully! Please login to join.");
      onClose();
      // In a real scenario, we might want to auto-login or redirect.
      // Since this dialog seems to be a 'quick join', ideally we would chain the join action.
      // However, for now, we just ensure it uses the correct API.
      if (typeof window !== 'undefined') {
        window.location.reload(); // Reload to pick up auth state if handled by cookies/context
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join {campaignTitle}</DialogTitle>
          <DialogDescription>
            Sign up to join this campaign and start earning rewards. Complete the form below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" placeholder="john.doe@example.com" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" placeholder="******" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSignUp} disabled={!name.trim() || !email.trim() || !password.trim() || isPending}>
            {isPending ? "Signing Up..." : "Sign Up & Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
