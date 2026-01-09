import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { TrainingVideo } from '@/services/training-videos/types';

interface TrainingVideoCardProps {
  video: TrainingVideo;
}

export default function TrainingVideoCard({ video }: TrainingVideoCardProps) {
  // New API doesn't have thumbnail_url. Using a placeholder or parsing video_url if possible.
  // For now, using a standard placeholder from remotePatterns or public assets.
  // Assuming videoUrl is a YouTube link, we might extract ID, but for simplicity let's use a placeholder or check if the mock type had it.
  // The mock type `TrainingVideo` from `mock-data/support` had `thumbnailUrl`.
  // The new API type `TrainingVideo` from `services` does NOT have `thumbnailUrl`.
  // We'll use a placeholder.
  const placeholderImage = 'https://placehold.co/800x450?text=Video+Thumbnail';

  return (
    <Card>
      <CardContent className="p-0 relative h-[200px] w-full bg-gray-100 flex items-center justify-center">
         {/* Since we don't have a thumbnail, maybe we just show an icon or use the placeholder.
             If Placehold.co is allowed (it is in remotePatterns memory), we use it. */}
        <Image
          src={placeholderImage}
          alt={video.title}
          fill
          className="rounded-t-lg object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <PlayCircle className="h-12 w-12 text-white opacity-80" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-bold line-clamp-1">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>
        <Button asChild className="w-full">
          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
            <PlayCircle className="mr-2 h-4 w-4" />
            Watch Video
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
