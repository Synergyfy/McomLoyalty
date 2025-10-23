'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
}

export function CloudinaryUpload({ onUpload }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Get signature from our API
      const paramsToSign = {
        timestamp: Math.round((new Date).getTime()/1000),
      };

      const signatureResponse = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        body: JSON.stringify({ paramsToSign }),
      });
      const { signature } = await signatureResponse.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('timestamp', paramsToSign.timestamp.toString());
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed.');
      }

      const data = await response.json();
      onUpload(data.secure_url);

    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('An error occurred during the upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <Button 
        type="button" 
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </>
  );
}