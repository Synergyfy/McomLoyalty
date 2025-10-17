"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = {
  businessName: string;
  businessEmail: string;
  staffName: string;
  staffEmail: string;
};

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const methods = useForm<FormValues>({
    defaultValues: {
      businessName: "",
      businessEmail: "",
      staffName: "",
      staffEmail: "",
    },
    mode: "onChange",
  });

  const nextStep = async () => {
    const valid = await methods.trigger(
      step === 1 ? ["businessName", "businessEmail"] : ["staffName", "staffEmail"]
    );
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (data: FormValues) => {
    alert(`🎉 Success!\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          {/* Step indicator */}
          <div className="flex justify-between mb-6 text-sm font-medium text-gray-600">
            <span className={step >= 1 ? "text-pink-600 font-bold" : ""}>
              1. Business
            </span>
            <span className={step >= 2 ? "text-pink-600 font-bold" : ""}>
              2. Staff
            </span>
            <span className={step >= 3 ? "text-pink-600 font-bold" : ""}>
              3. Review
            </span>
          </div>

          {/* Step 1 — Business Info */}
          {step === 1 && (
            <StepBusiness onNext={nextStep} />
          )}

          {/* Step 2 — Staff Info */}
          {step === 2 && (
            <StepStaff onNext={nextStep} onBack={prevStep} />
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <StepReview onBack={prevStep} onSubmit={methods.handleSubmit(onSubmit)} />
          )}
        </motion.div>
      </div>
    </FormProvider>
  );
}

/* ---------- Step 1 ---------- */
function StepBusiness({ onNext }: { onNext: () => void }) {
  const { register, formState: { errors } } = useFormContext<FormValues>();

  return (
    <form className="space-y-4">
      <div>
        <Label>Business Name</Label>
        <Input
          {...register("businessName", { required: "Business name is required" })}
          placeholder="e.g. Glow Beauty Spa"
        />
        {errors.businessName && (
          <p className="text-red-500 text-sm">{errors.businessName.message}</p>
        )}
      </div>
      <div>
        <Label>Business Email</Label>
        <Input
          type="email"
          {...register("businessEmail", { required: "Email is required" })}
          placeholder="e.g. info@glowbeauty.com"
        />
        {errors.businessEmail && (
          <p className="text-red-500 text-sm">{errors.businessEmail.message}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext}>Next</Button>
      </div>
    </form>
  );
}

/* ---------- Step 2 ---------- */
function StepStaff({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { register, formState: { errors } } = useFormContext<FormValues>();

  return (
    <form className="space-y-4">
      <div>
        <Label>Staff Name</Label>
        <Input
          {...register("staffName", { required: "Staff name is required" })}
          placeholder="e.g. Ama Mensah"
        />
        {errors.staffName && (
          <p className="text-red-500 text-sm">{errors.staffName.message}</p>
        )}
      </div>
      <div>
        <Label>Staff Email</Label>
        <Input
          type="email"
          {...register("staffEmail", { required: "Staff email is required" })}
          placeholder="e.g. ama@glowbeauty.com"
        />
        {errors.staffEmail && (
          <p className="text-red-500 text-sm">{errors.staffEmail.message}</p>
        )}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </form>
  );
}

/* ---------- Step 3 ---------- */
function StepReview({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { getValues } = useFormContext<FormValues>();
  const data = getValues();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="font-semibold text-gray-800">Review Details</h3>
      <ul className="text-sm text-gray-600 space-y-2">
        <li>
          <strong>Business:</strong> {data.businessName}
        </li>
        <li>
          <strong>Email:</strong> {data.businessEmail}
        </li>
        <li>
          <strong>Staff:</strong> {data.staffName}
        </li>
        <li>
          <strong>Staff Email:</strong> {data.staffEmail}
        </li>
      </ul>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
