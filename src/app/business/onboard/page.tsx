// src/app/business/signup/page.tsx
import React from "react";
import MultiStepWizard from "@/components/Forms/MultiStepWizard";

export default function BusinessSignupPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <MultiStepWizard />
      </div>
    </main>
  );
}
