'use client';

import { useGetAllStaff, useDeleteStaff } from '@/services/staff/hook';
import { Staff } from '@/services/staff/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit, Trash2, UserCircle } from 'lucide-react';
import { useState } from 'react';

const AllStaffPage = () => {
  const router = useRouter();
  const { data: staffList, isLoading, isError, error } = useGetAllStaff();
  const deleteStaffMutation = useDeleteStaff();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/staff/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteStaffMutation.mutate(id, {
      onSuccess: () => {
        setShowConfirm(null);
      },
    });
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
        <p>Error loading staff: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        All Staff
      </h1>
      <div className="overflow-x-auto rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Avatar
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Email
              </th>
              <th
                scope="col"
                className="relative px-6 py-3"
              >
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {staffList?.map((staff: Staff) => (
              <tr key={staff.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  {staff.avatar ? (
                    <Image
                      src={staff.avatar}
                      alt={staff.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircle className="h-10 w-10 text-gray-400" />
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {staff.name}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {staff.email}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <button
                      onClick={() => handleEdit(staff.id)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowConfirm(staff.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this staff member?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(null)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showConfirm)}
                disabled={deleteStaffMutation.isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteStaffMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStaffPage;
