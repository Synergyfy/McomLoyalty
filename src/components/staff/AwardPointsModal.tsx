"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Receipt, Phone, Loader2, CheckCircle } from "lucide-react";
import { useScanParticipant, useGenerateCode, useDualScan } from "@/services/participant-campaign-balance/hook";
import { toast } from "sonner";

interface AwardPointsModalProps {
  campaignId: string;
  campaignName: string;
  staffCode?: string; // Optional, can be pre-filled if available
}

export function AwardPointsModal({ campaignId, campaignName, staffCode }: AwardPointsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [points, setPoints] = useState<number>(50); // Default to 50 as per scenario, but editable

  // Method A State
  const [participantCodeA, setParticipantCodeA] = useState("");

  // Method C State
  const [participantCodeC, setParticipantCodeC] = useState("");
  const [staffCodeInput, setStaffCodeInput] = useState(staffCode || "");

  // Results
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const { mutateAsync: scanParticipant, isPending: isScanning } = useScanParticipant();
  const { mutateAsync: generateCode, isPending: isGenerating } = useGenerateCode();
  const { mutateAsync: dualScan, isPending: isDualScanning } = useDualScan();

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scanParticipant({
        campaignId,
        participantCode: participantCodeA,
        points,
        type: 'EARN'
      });
      toast.success(`Successfully awarded ${points} points to ${participantCodeA}`);
      setIsOpen(false);
      setParticipantCodeA("");
    } catch (error) {
      toast.error("Failed to award points via scan.");
      console.error(error);
    }
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await generateCode({
        campaignId,
        points,
        type: 'EARN'
      });
      setGeneratedCode(result.code);
      toast.success("Claim code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate code.");
      console.error(error);
    }
  };

  const handleDualScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dualScan({
        campaignId,
        participantCode: participantCodeC,
        staffOrBusinessCode: staffCodeInput,
        points,
        type: 'EARN'
      });
      toast.success(`Successfully awarded ${points} points to ${participantCodeC}`);
      setIsOpen(false);
      setParticipantCodeC("");
    } catch (error) {
      toast.error("Failed to award points via dual verification.");
      console.error(error);
    }
  };

  const resetState = () => {
    setGeneratedCode(null);
    setParticipantCodeA("");
    setParticipantCodeC("");
    setPoints(50);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetState(); }}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full md:w-auto">
          <QrCode className="h-4 w-4" />
          Award Points
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Award Points</DialogTitle>
          <DialogDescription>
            Choose a method to award points for <strong>{campaignName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan" className="flex gap-2 items-center">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Direct Scan</span>
            </TabsTrigger>
            <TabsTrigger value="receipt" className="flex gap-2 items-center">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Generate Code</span>
            </TabsTrigger>
            <TabsTrigger value="dual" className="flex gap-2 items-center">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Remote/Phone</span>
            </TabsTrigger>
          </TabsList>

          {/* Method A: Direct Scan */}
          <TabsContent value="scan" className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Use this when the customer is present and shows their QR code.
              </p>
              <form onSubmit={handleScanSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="points-a">Points to Award</Label>
                  <Input
                    id="points-a"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participant-code-a">Participant Unique Code (from QR)</Label>
                  <Input
                    id="participant-code-a"
                    placeholder="e.g., ALICE0001"
                    value={participantCodeA}
                    onChange={(e) => setParticipantCodeA(e.target.value)}
                    required
                  />
                  {/* In a real app, a QR Scanner component would act here */}
                </div>
                <Button type="submit" className="w-full" disabled={isScanning}>
                  {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Award Points"}
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Method B: Generate Code */}
          <TabsContent value="receipt" className="space-y-4 py-4">
             <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Generate a code to write on a receipt for the customer to claim later.
              </p>
              {!generatedCode ? (
                <form onSubmit={handleGenerateSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="points-b">Points to Award</Label>
                    <Input
                      id="points-b"
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      min={1}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Code"}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 bg-green-50 p-6 rounded-lg border border-green-100">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <div className="text-center">
                    <p className="text-sm text-green-600 font-medium">Code Generated Successfully!</p>
                    <p className="text-3xl font-mono font-bold tracking-widest text-gray-900 mt-2">{generatedCode}</p>
                    <p className="text-xs text-gray-500 mt-2">Write this on the receipt.</p>
                  </div>
                  <Button variant="outline" onClick={() => setGeneratedCode(null)} className="w-full">
                    Generate Another
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Method C: Dual Scan */}
          <TabsContent value="dual" className="space-y-4 py-4">
             <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Use this for remote orders or when manual verification is needed.
              </p>
              <form onSubmit={handleDualScanSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="points-c">Points to Award</Label>
                  <Input
                    id="points-c"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participant-code-c">Participant Code</Label>
                  <Input
                    id="participant-code-c"
                    placeholder="e.g., ALICE0001"
                    value={participantCodeC}
                    onChange={(e) => setParticipantCodeC(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-code">Staff/Business Code</Label>
                  <Input
                    id="staff-code"
                    placeholder="e.g., BOB456789"
                    value={staffCodeInput}
                    onChange={(e) => setStaffCodeInput(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isDualScanning}>
                   {isDualScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Award"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
