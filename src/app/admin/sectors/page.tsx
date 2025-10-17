'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateSector } from '@/hooks/useCreateSector';
import { CreateSectorRequest } from '@/types/sectors';
import { useGetSectors } from '@/hooks/useGetSectors';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

export default function SectorsPage() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const createSectorMutation = useCreateSector();
  const { data: sectors, isLoading: isLoadingSectors } = useGetSectors();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sectorData: CreateSectorRequest = { name, imageUrl };
    createSectorMutation.mutate(sectorData, {
      onSuccess: () => {
        alert('Sector created successfully!');
        setName('');
        setImageUrl('');
      },
      onError: (error) => {
        alert(`Error creating sector: ${error.message}`);
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5 text-primary">Sectors</h1>
      <p className="mb-5">Manage sectors for the loyalty platform.</p>

      <Card className="max-w-md mb-10">
        <CardHeader>
          <CardTitle>Create New Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Sector Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter sector name"
                required
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={createSectorMutation.isPending}
              className="w-full"
            >
              {createSectorMutation.isPending ? 'Creating...' : 'Create Sector'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-5">All Sectors</h2>

      {isLoadingSectors ? (
        <p>Loading sectors...</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectors && sectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell>{sector.name}</TableCell>
                  <TableCell>
                    <Image
                      src={sector.imageUrl}
                      alt={sector.name}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
