import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import api, { setBearerToken } from '../api';
import {  Business,  BusinessLoginDto,  BusinessLoginResponse,  Sector, BusinessSignUpDto, businessOnboardDto} from './types';
import Cookies from 'js-cookie';

const BUSINESS_QUERY_KEY = 'business';

// Business Sign-up

const initialBusinessSignUp = async (signUpData: BusinessSignUpDto): Promise<Business> => {
  const { data } = await api.post<Business>('/business/signup', signUpData);
  return data;
}

export const useBusinessSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initialBusinessSignUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUSINESS_QUERY_KEY] });
    },
  });
};


// Business onboard
const businessOnboard = async (onboardData: businessOnboardDto): Promise<Business> => {
  const { data } = await api.post<Business>('/business/onboard', onboardData);
  return data;
};

export const useBusinessOnboard = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: businessOnboard,
    mutationKey: [BUSINESS_QUERY_KEY],
    onSuccess: () =>
    {
      QueryClient.invalidateQueries({queryKey: [BUSINESS_QUERY_KEY]})
    }

  })
}

// Get Sectors
const getSectors = async (): Promise<Sector[]> => {
  const { data } = await api.get<Sector[]>('/sectors');
  return data;
};

export const useGetSectors = () => {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
  });
};

// Business Login
const businessSignIn = async (loginData: BusinessLoginDto): Promise<BusinessLoginResponse> => {
  const { data } = await api.post<BusinessLoginResponse>('/auth/login', loginData);
  return data;
};

export const useBusinessSignIn = () => {
  return useMutation({
    mutationFn: businessSignIn,
    onSuccess: (data) => {
      Cookies.set('access', data.access_token);
      Cookies.set('refresh', data.refresh_token);
      setBearerToken(data.access_token);
    },
  });
};
