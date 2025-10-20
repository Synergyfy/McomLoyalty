// src/lib/validators/signupSchemas.ts
import * as z from "zod";

export const businessInfoSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessSector: z.string().min(2, "Select a sector"),
  businessEmail: z.email("Valid email is required"),
  businessPhone: z.string().optional().nullable(),
  businessAddress: z.string().optional().nullable(),
  businessWebsite: z.url().optional().nullable(),
  businessLogo: z
  .any()
  .refine(
    (file) => {
      if (!file) return true; // optional
      return file instanceof File && ["image/png", "image/jpeg", "image/webp"].includes(file.type);
    },
    { message: "Only PNG, JPEG, or WEBP images allowed" }
  )
  .optional()
  .nullable(),
});

export const staffSchema = z.object({
  staffName: z.string().min(2, "Staff name required").optional().nullable(),
  staffEmail: z.email("Valid staff email required").optional().nullable(),
  staffPassword: z.string().min(10, "Valid staff password required").optional().nullable(),
  staffAvatar: z
    .any()
    .refine(
      (file) => {
        if (file == null) return true; // optional
        return file instanceof File;
      },
      { message: "Invalid file type" }
    ).optional()
    .nullable(),


});

export const rewardSchema = z.object({
  rewardTitle: z.string().min(2, "Reward title required"),
  pointsRequired: z.number().min(1, "Points must be >= 1"),
  cashValue: z.number().min(0, "Cash value must be >= 0"),
  rewardDescription: z.string().optional().nullable(),
  rewardImage: z
    .any()
    .refine(
      (file) => {
        if (file == null) return false; // required
        return file instanceof File;
      },
      { message: "Invalid file type" }
    )
});

export const onboardingFullSchema = z.object({
  ...businessInfoSchema.shape,
  ...staffSchema.shape,
  ...rewardSchema.shape,
})
