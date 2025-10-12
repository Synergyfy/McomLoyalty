'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useGetStaffById,
  useUpdateStaff,
} from '@/services/staff/hook';
import { UpdateStaffDto } from '@/services/staff/types';
import { useRouter, useParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const editStaffSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type EditStaffFormValues = z.infer<typeof editStaffSchema>;

const EditStaffPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: staff, isLoading, isError } = useGetStaffById(id);
  const updateStaffMutation = useUpdateStaff();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
  });

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name,
        email: staff.email,
        avatar: staff.avatar || '',
      });
    }
  }, [staff, reset]);

  const onSubmit: SubmitHandler<EditStaffFormValues> = (data) => {
    const { ...updateData } = data;
    if (!updateData.password) {
      delete updateData.password;
    }
    updateStaffMutation.mutate(
      { id, ...updateData },
      {
        onSuccess: () => {
          router.push('/dashboard/staff/all');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-orange-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        <p>Error loading staff member.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Edit Staff
      </h1>
      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              New Password (Optional)
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Avatar URL (Optional)
            </label>
            <input
              id="avatar"
              type="text"
              {...register('avatar')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.avatar && (
              <p className="mt-2 text-sm text-red-600">{errors.avatar.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={updateStaffMutation.isPending}
              className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {updateStaffMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            {updateStaffMutation.isError && (
              <p className="mt-2 text-sm text-red-600">
                {updateStaffMutation.error?.message || 'An error occurred'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffPage;
