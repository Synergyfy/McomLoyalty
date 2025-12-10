'use client';

import React, { useState } from 'react';
import { useGetEarningActions, useCreateEarningAction, useUpdateEarningAction } from '@/services/matching-points/hook';
import { EarningAction, CreateEarningActionDto } from '@/services/matching-points/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const EarningActionsManager = () => {
    const { data: actions, isLoading } = useGetEarningActions();
    const { mutate: createAction, isPending: isCreating } = useCreateEarningAction();
    const { mutate: updateAction, isPending: isUpdating } = useUpdateEarningAction();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAction, setEditingAction] = useState<EarningAction | null>(null);
    const [formData, setFormData] = useState<Partial<CreateEarningActionDto>>({
        isActive: true,
        actionParameters: {}
    });

    const handleOpenCreate = () => {
        setEditingAction(null);
        setFormData({ isActive: true, actionParameters: {} });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (action: EarningAction) => {
        setEditingAction(action);
        setFormData({
            name: action.name,
            key: action.key,
            points: action.points,
            description: action.description,
            isActive: action.isActive,
            actionParameters: action.actionParameters || {}
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.key || formData.points === undefined) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload = {
            name: formData.name,
            key: formData.key,
            points: Number(formData.points),
            description: formData.description,
            isActive: formData.isActive,
            actionParameters: formData.actionParameters
        } as CreateEarningActionDto;

        if (editingAction) {
            updateAction({ id: editingAction.id, payload }, {
                onSuccess: () => {
                    toast.success("Rule updated successfully");
                    setIsModalOpen(false);
                },
                onError: () => toast.error("Failed to update rule")
            });
        } else {
            createAction(payload, {
                onSuccess: () => {
                    toast.success("Rule created successfully");
                    setIsModalOpen(false);
                },
                onError: () => toast.error("Failed to create rule")
            });
        }
    };

    // Helper to parse/stringify action parameters for the simplistic JSON input
    const handleParamsChange = (value: string) => {
        try {
            const parsed = JSON.parse(value);
            setFormData({ ...formData, actionParameters: parsed });
        } catch (e) {
            // Allow typing invalid json, validate on save or just let it stay as previous valid object if complex logic needed
            // For now, we won't update state if invalid to prevent saving bad json, 
            // but for a text area feeling we might need a separate string state.
            // Simplified: we will just assume simple key-values for now or leave empty if invalid
        }
    };

    const [paramsString, setParamsString] = useState("{}");

    // Sync params string when opening modal
    React.useEffect(() => {
        setParamsString(JSON.stringify(formData.actionParameters || {}, null, 2));
    }, [formData.actionParameters, isModalOpen]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Earning Actions
                    </CardTitle>
                    <CardDescription>Define how participants earn matching points.</CardDescription>
                </div>
                <Button onClick={handleOpenCreate} size="sm">
                    <Plus className="h-4 w-4 mr-2" /> New Rule
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Points</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {actions?.map((action) => (
                                <TableRow key={action.id}>
                                    <TableCell className="font-medium">
                                        {action.name}
                                        {action.description && <p className="text-xs text-muted-foreground">{action.description}</p>}
                                    </TableCell>
                                    <TableCell><code className="bg-muted px-1 rounded text-xs">{action.key}</code></TableCell>
                                    <TableCell>{action.points}</TableCell>
                                    <TableCell>
                                        <Badge variant={action.isActive ? "default" : "secondary"}>
                                            {action.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(action)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!actions || actions.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No earning rules defined yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingAction ? 'Edit Earning Rule' : 'Create Earning Rule'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="key" className="text-right">System Key</Label>
                            <Input id="key" value={formData.key || ''} onChange={(e) => setFormData({ ...formData, key: e.target.value })} className="col-span-3" placeholder="e.g. LOGIN_DAILY" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="points" className="text-right">Points</Label>
                            <Input id="points" type="number" value={formData.points || 0} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="params" className="text-right">Parameters (JSON)</Label>
                            <Textarea
                                id="params"
                                value={paramsString}
                                onChange={(e) => {
                                    setParamsString(e.target.value);
                                    handleParamsChange(e.target.value);
                                }}
                                className="col-span-3 font-mono text-xs"
                                placeholder='{"daily": 1}'
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Active</Label>
                            <div className="col-span-3 flex items-center space-x-2">
                                <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} />
                                <span>{formData.isActive ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                            {isCreating || isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Rule'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
