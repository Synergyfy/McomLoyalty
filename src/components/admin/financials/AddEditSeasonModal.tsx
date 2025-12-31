'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateSeason, useUpdateSeason } from '@/services/financials';
import { Season } from '@/services/financials/types';

interface AddEditSeasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Season;
}

export function AddEditSeasonModal({ isOpen, onClose, initialData }: AddEditSeasonModalProps) {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [bgColor, setBgColor] = useState('#000000');
    const [borderColor, setBorderColor] = useState('#DDDDDD');

    const createSeasonMutation = useCreateSeason();
    const updateSeasonMutation = useUpdateSeason();

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setStartDate(new Date(initialData.startDate).toISOString().slice(0, 16));
            setEndDate(new Date(initialData.endDate).toISOString().slice(0, 16));
            setDescription(initialData.description || '');
            setTextColor(initialData.textColor || '#FFFFFF');
            setBgColor(initialData.bgColor || '#000000');
            setBorderColor(initialData.borderColor || '#DDDDDD');
        } else {
            setName('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            setTextColor('#FFFFFF');
            setBgColor('#ea580c'); // Default brand color or something vibrant
            setBorderColor('#c2410c');
        }
    }, [initialData, isOpen]);

    const handleSubmit = async () => {
        const seasonData = {
            name,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            description,
            textColor,
            bgColor,
            borderColor,
        };

        try {
            if (initialData) {
                await updateSeasonMutation.mutateAsync({ ...seasonData, id: initialData.id });
            } else {
                await createSeasonMutation.mutateAsync(seasonData);
            }
            onClose();
        } catch (error) {
            alert('Error saving season');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit' : 'Create'} Season</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="season-name">Season Name</Label>
                        <Input id="season-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer 2025" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input id="start-date" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end-date">End Date</Label>
                            <Input id="end-date" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this season..." />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="text-color">Text Color</Label>
                            <div className="flex gap-2">
                                <Input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-10 p-1" />
                                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bg-color">BG Color</Label>
                            <div className="flex gap-2">
                                <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1" />
                                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="border-color">Border Color</Label>
                            <div className="flex gap-2">
                                <Input id="border-color" type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-12 h-10 p-1" />
                                <Input value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="flex-1" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 rounded border text-center font-bold" style={{ backgroundColor: bgColor, color: textColor, borderColor: borderColor, borderWidth: '2px' }}>
                        Preview Seasonal Card
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={createSeasonMutation.isPending || updateSeasonMutation.isPending}>
                        {createSeasonMutation.isPending || updateSeasonMutation.isPending ? 'Saving...' : 'Save Season'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
