import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { setBearerToken } from '../api';
import {
  CreateStaffDto,
  Staff,
  StaffLoginDto,
  StaffLoginResponse,
  UpdateStaffDto,
} from './types';
import Cookies from 'js-cookie';

const STAFF_QUERY_KEY = 'staff';

// Staff Login
const staffLogin = async (
  loginData: StaffLoginDto
): Promise<StaffLoginResponse> => {
  const { data } = await api.post<StaffLoginResponse>(
    '/staff/login',
    loginData
  );
  return data;
};

export const useStaffLogin = () => {
  return useMutation({
    mutationFn: staffLogin,
    onSuccess: (data) => {
      Cookies.set('access', data.access_token);
      Cookies.set('refresh', data.refresh_token);
      setBearerToken(data.access_token);
    },
  });
};

// Create a New Staff Member
const createStaff = async (staffData: CreateStaffDto): Promise<Staff> => {
  const { data } = await api.post<Staff>('/staff', staffData);
  return data;
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
    },
  });
};

// Get All Staff Members
const getAllStaff = async (): Promise<Staff[]> => {
  const { data } = await api.get<Staff[]>('/staff');
  return data;
};

export const useGetAllStaff = () => {
  return useQuery({
    queryKey: [STAFF_QUERY_KEY],
    queryFn: getAllStaff,
  });
};

// Get a Single Staff Member by ID
const getStaffById = async (id: string): Promise<Staff> => {
  const { data } = await api.get<Staff>(`/staff/${id}`);
  return data;
};

export const useGetStaffById = (id: string) => {
  return useQuery({
    queryKey: [STAFF_QUERY_KEY, id],
    queryFn: () => getStaffById(id),
    enabled: !!id, // Only run the query if the id is not null or undefined
  });
};

// Update a Staff Member
const updateStaff = async ({
  id,
  ...updateData
}: {
  id: string;
} & UpdateStaffDto): Promise<Staff> => {
  const { data } = await api.patch<Staff>(`/staff/${id}`, updateData);
  return data;
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStaff,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
      queryClient.setQueryData([STAFF_QUERY_KEY, data.id], data);
    },
  });
};

// Delete a Staff Member
const deleteStaff = async (id: string): Promise<void> => {
  await api.delete(`/staff/${id}`);
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_QUERY_KEY] });
    },
  });
};
