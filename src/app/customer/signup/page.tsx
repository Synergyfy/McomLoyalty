"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { participantSignUpSchema } from "@/lib/validators/participantSchemas";
import { ParticipantSignUpDto } from "@/services/participant/types";
import { useCampaignMembership } from "@/context/CampaignMembershipContext";
import { z } from "zod";

// Extend the schema to include 'agree' if it's not part of the DTO but required for UI
const uiSignUpSchema = participantSignUpSchema.extend({
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions",
  }),
  phone: z.string().optional(), // Adding phone as optional since it was in the UI but maybe not in schema yet
  location: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
});

type UiSignUpFormData = z.infer<typeof uiSignUpSchema>;

export default function CustomerSignupPage() {
  const router = useRouter();
  const { signup } = useCampaignMembership();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UiSignUpFormData>({
    resolver: zodResolver(uiSignUpSchema),
    defaultValues: {
      agree: false
    }
  });

  const onSubmit = async (data: UiSignUpFormData) => {
    try {
      // Prepare data for API (exclude UI-only fields if necessary)
      const apiData: ParticipantSignUpDto = {
        name: data.name,
        email: data.email,
        password: data.password,
        // If the API accepts phone/etc, add them here.
        // The base schema currently only has name, email, password.
      };

      await signup(apiData);
      toast.success("Account created successfully! 🎉");
      router.push("/redemption"); // Or redirect to dashboard/campaigns
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Failed to create account. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    toast.info("Redirecting to Google Sign-In...");
    // TODO: integrate Google OAuth flow here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Join <span className="text-orange-500">MCOM Rewards</span>
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Sign up to start earning rewards and discovering local deals
        </p>

        {/* Google Sign-In */}
        <Button
          type="button"
          onClick={handleGoogleSignup}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* SIGNUP FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+2348012345678"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" {...register("birthday")} />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                {...register("gender")}
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Lagos, Nigeria"
              {...register("location")}
            />
          </div>

          <Controller
            name="agree"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agree"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <Label htmlFor="agree" className="text-sm">
                  I agree to the{" "}
                  <a href="/terms" className="text-orange-500 underline">
                    Terms & Conditions
                  </a>
                </Label>
              </div>
            )}
          />
          {errors.agree && (
            <p className="text-red-500 text-sm">{errors.agree.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Join MCOM Rewards"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/customer/login"
            className="text-orange-500 hover:underline font-medium"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
