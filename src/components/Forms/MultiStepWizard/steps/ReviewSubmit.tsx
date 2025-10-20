// src/components/forms/MultiStepWizard/steps/ReviewSubmit.tsx
"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";

export default function ReviewSubmitStep() {
  const { getValues } = useFormContext();
  const values = getValues();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review your details</h3>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <dl className="grid grid-cols-1 gap-2">
          <div>
            <dt className="text-xs text-gray-500">Business</dt>
            <dd className="font-medium">{values.businessName}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Sector</dt>
            <dd>{values.businessSector}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Email</dt>
            <dd>{values.businessEmail}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Website</dt>
            <dd>{values.businessWebsite}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Phone</dt>
            <dd>{values.businessPhone || "N/A"}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Address</dt>
            <dd>{values.businessAddress || "N/A"}</dd>
          </div>

          <div>
            <dt className="text-xs text-gray-500">Staff</dt>
            <dd>{values.staffName ? `${values.staffName} — ${values.staffEmail}` : "No staff added"}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Sample reward</dt>
            <dd>{values.rewardTitle ? `${values.rewardTitle} — ${values.pointsRequired} pts` : "No sample reward"}</dd>
            
          </div>
        </dl>
        <div>
          <Image
            src={values.rewardImage ? values.rewardImage.url : "/placeholder.png"}
            alt={values.rewardImage ? values.rewardImage.name : "Placeholder"}
            width={100}
            height={100}
          />
        </div>
        
      
      </div>
      <p className="text-sm text-gray-600">
        When you click Submit we will create your business profile, queue emails and create a starter campaign. You can change everything later from the dashboard.
      </p>
    </div>
  );
}
