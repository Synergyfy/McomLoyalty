"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { participantLoginSchema } from "@/lib/validators/participantSchemas";
import { ParticipantLoginDto } from "@/services/participant/types";
import { useParticipantLogin } from "@/services/participant/hook";
import { useCampaignMembership } from "@/context/CampaignMembershipContext";

export default function CustomerLoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ParticipantLoginDto>({
    resolver: zodResolver(participantLoginSchema),
  });
  const router = useRouter();
  // Use the context's login function which wraps the hook and handles state updates
  const { login } = useCampaignMembership();

  const onSubmit = async (data: ParticipantLoginDto) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push("/redemption"); // Or redirect to dashboard/campaigns
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google...");
    // Implement Google login logic here if needed
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome Back to <span className="text-orange-500">MCOM Rewards</span>
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Log in to manage your rewards and favorite campaigns
        </p>

        {/* Google Login */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
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

        {/* Email Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/customer/signup" className="text-orange-500 hover:underline font-medium">
            Join now
          </a>
        </p>
      </div>
    </div>
  );
}
