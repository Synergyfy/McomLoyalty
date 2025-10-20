// src/components/forms/MultiStepWizard/steps/StaffSetup.tsx
"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StaffSetupStep() {
  const { register, formState: { errors }, setValue } = useFormContext();

  return (
    <div className="grid gap-4">
      <p className="text-sm text-gray-600">
        Add one staff member to start (optional). You can add more later in the dashboard.
      </p>

      <div>
        <Label>Staff Name</Label>
        <Input {...register("staffName")} />
        {errors.staffName && <p className="text-red-500 text-sm">{errors.staffName.message as unknown as string}</p>}
      </div>

      <div>
        <Label>Staff Email</Label>
        <Input type="email" {...register("staffEmail")} />
        {errors.staffEmail && <p className="text-red-500 text-sm">{errors.staffEmail.message as unknown as string}</p>}
      </div>
      <div>
        <Label>Staff Password</Label>
        <Input type="password" {...register("staffPassword")} />
        {errors.staffPassword && <p className="text-red-500 text-sm">{errors.staffPassword.message as unknown as string}</p>}
      </div>
      <div>
        <Label>Upload Avatar</Label>
        <Input type="file" onChange={(e) => {
          const file = e.target.files?.[0] || null
          setValue("staffAvatar", file)
        }} />
        {errors.staffAvatar && <p className="text-red-500 text-sm">{errors.staffAvatar.message as unknown as string}</p>}
      </div>
    </div>
  );
}
