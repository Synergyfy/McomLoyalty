// src/components/forms/MultiStepWizard/steps/BusinessInfo.tsx
"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input"; // use your input component or plain input
import { Label } from "@/components/ui/label";

export default function BusinessInfoStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext();

  return (
    <div className="grid gap-4">
      <div>
        <Label>Business Name</Label>
        <Input {...register("businessName")} />
        {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message as unknown as string}</p>}
      </div>

      <div>
        <Label>Sector</Label>
        <select {...register("businessSector")} className="w-full border rounded p-2">
          <option value="">Select sector</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Services">Services</option>
          <option value="Others">Others</option>
        </select>
        {errors.businessSector && <p className="text-red-500 text-sm">{errors.businessSector.message as unknown as string}</p>}
      </div>

      <div>
        <Label>Business Email</Label>
        <Input type="email" {...register("businessEmail")} />
        {errors.businessEmail && <p className="text-red-500 text-sm">{errors.businessEmail.message as unknown as string}</p>}
      </div>

      <div>
        <Label>Phone</Label>
        <Input {...register("businessPhone")} />
      </div>

      <div>
        <Label>Website</Label>
        <Input {...register("businessWebsite")} />
        {errors.businessWebsite && <p className="text-red-500 text-sm">{errors.businessWebsite.message as unknown as string}</p>}
      </div>
      <div>
      <Label>Upload Logo</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setValue("businessLogo", file, { shouldValidate: true });
        }}
      />
      {watch("businessLogo") && (
        <p>Selected file: {watch("businessLogo")?.name}</p>
      )}
      {errors.businessLogo && (
        <p className="text-red-500 text-sm">{errors.businessLogo.message as unknown as string}</p>
      )}
    </div>

    </div>
  );
}
