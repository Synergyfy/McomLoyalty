"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getCentralCustomerSignupUrl } from "@/lib/sso-utils";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CustomerSignupPage() {
  const handleRedirectToCentral = () => {
    window.location.href = getCentralCustomerSignupUrl();
  };

  useEffect(() => {
    // Automatically redirect to MCOM Solutions Central Registration
    const timer = setTimeout(() => {
      handleRedirectToCentral();
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-800">
      <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto border border-orange-200">
          <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Redirecting to Central Auth
          </h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            You are being taken to MCOM Solutions to create your customer account seamlessly.
          </p>
        </div>

        <Button
          onClick={handleRedirectToCentral}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl shadow-sm flex items-center justify-center gap-2"
        >
          <span>Continue to Signup</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
