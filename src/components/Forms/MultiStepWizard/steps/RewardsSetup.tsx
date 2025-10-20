// src/components/forms/MultiStepWizard/steps/RewardsSetup.tsx
"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RewardsSetupStep() {
  const { register, formState: { errors }, setValue } = useFormContext();

  return (
    <div className="grid gap-4">
      <p className="text-sm text-gray-600">Create a sample reward (you can add more later).</p>

      <div>
        <Label>Reward Title</Label>
        <Input {...register("rewardTitle")} />
        {errors.rewardTitle && <p className="text-red-500 text-sm">{errors.rewardTitle.message as unknown as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Points Required</Label>
          <Input type="number" {...register("pointsRequired", { valueAsNumber: true })} />
          {errors.pointsRequired && <p className="text-red-500 text-sm">{errors.pointsRequired.message as unknown as string}</p>}
        </div>
        <div>
          <Label>Cash Value</Label>
          <Input type="number" {...register("cashValue", { valueAsNumber: true })} />
          {errors.cashValue && <p className="text-red-500 text-sm">{errors.cashValue.message as unknown as string}</p>}
        </div>
      </div>

      <div>
        <Label>Short Description</Label>
        <Input required {...register("rewardDescription")} />
        {errors.rewardDescription && <p className="text-red-500 text-sm">{errors.rewardDescription.message as unknown as string}</p>}
      </div>
      <div>
        <Label>Reward Image</Label>
        <Input required type="file"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setValue("rewardImage", file, { shouldValidate: true });
          }}
        />
        {errors.rewardImage && <p className="text-red-500 text-sm">{errors.rewardImage.message as unknown as string}</p>}
      </div>
    </div>
  );
}
