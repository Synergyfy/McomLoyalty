'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateReward } from "@/services/rewards/hook";
import { CreateRewardRequest } from "@/services/rewards/types";
import { useState } from "react";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import Image from "next/image";

interface CreateRewardDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRewardDialog({ isOpen, onClose }: CreateRewardDialogProps) {
  const [title, setTitle] = useState('');
  const [pointsRequired, setPointsRequired] = useState(0);
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(0);
  const { mutate: createReward, isPending: isCreatingReward } = useCreateReward();

  const handleSubmit = () => {
    const rewardData: CreateRewardRequest = {
      title,
      points_required: pointsRequired,
      value,
      description,
      image,
      quantity,
    };
    createReward(rewardData, {
      onSuccess: () => {
        alert('Reward created successfully!');
        onClose();
      },
      onError: (error) => {
        alert(`Error creating reward: ${error.message}`);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Reward</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right col-span-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="pointsRequired" className="text-right col-span-1">
              Points
            </label>
            <Input
              id="pointsRequired"
              type="number"
              value={pointsRequired}
              onChange={(e) => setPointsRequired(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="value" className="text-right col-span-1">
              Value
            </label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right col-span-1">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="image" className="text-right col-span-1">
              Image
            </label>
            <CloudinaryUpload onUpload={setImage} />
            {image && (
              <div className="col-span-4 mt-4">
                <p className="text-sm font-medium">Uploaded Image:</p>
                <div className="relative h-24 w-24 rounded-full overflow-hidden">
                  <Image
                    src={image}
                    alt="Uploaded reward image"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="quantity" className="text-right col-span-1">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isCreatingReward}>
          {isCreatingReward ? 'Creating...' : 'Create Reward'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
