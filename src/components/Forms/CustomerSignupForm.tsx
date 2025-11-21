"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useParticipantSignUp } from "@/services/auth/hook";
import { ParticipantSignupDto } from "@/services/auth/types";

type SignupData = ParticipantSignupDto & {
  agree: boolean;
};

export default function CustomerSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const { mutateAsync: signup } = useParticipantSignUp();

  const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      watch,
      setValue
  } = useForm<SignupData>();

  const agree = watch('agree');

  const onSubmit = async (data: SignupData) => {
    if (!data.agree) {
      toast.error("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      // Remove 'agree' from data before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { agree, ...signupData } = data;

      await signup(signupData);
      toast.success("Account created successfully! 🎉");

      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else {
        router.push("/campaigns"); // Default redirect
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    toast.info("Redirecting to Google Sign-In...");
    // TODO: integrate Google OAuth flow here
  };

  return (
    <div className="flex items-center justify-center bg-white ">
      <div className="w-full max-w-md bg-white rounded-2xl space-y-6">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              placeholder="John Doe"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              placeholder="+2348012345678"
              {...register("phone")}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Birthday</Label>
              <Input type="date" {...register("birthday")} />
            </div>
            <div>
              <Label>Gender</Label>
              <select
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
            <Label>Location</Label>
            <Input
              placeholder="e.g. Lagos, Nigeria"
              {...register("location")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
                id="terms"
                checked={agree}
                onCheckedChange={(checked) => setValue('agree', checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I agree to the <a href="#" className="text-orange-500 hover:underline">Terms & Conditions</a>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Join MCOM Rewards"}
          </Button>
        </form>
      </div>
    </div>
  );
}
