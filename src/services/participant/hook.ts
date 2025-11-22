import api, { setBearerToken } from '../api';
import { ParticipantLoginDto, ParticipantLoginResponse, ParticipantSignupDto, JoinCampaignDto, JoinCampaignResponse } from './types';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// Participant Login
const participantLogin = async (loginData: ParticipantLoginDto): Promise<ParticipantLoginResponse> => {
  const { data } = await api.post<ParticipantLoginResponse>('/participant/login', loginData);
  return data;
};

export const useParticipantLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: participantLogin,
    onSuccess: (data) => {
      Cookies.set('access', data.accessToken);
      Cookies.set('refresh', data.refreshToken);
      setBearerToken(data.accessToken);

      // Redirect logic will be handled in the component to support returnUrl
    },
  });
};

// Participant Signup
const participantSignup = async (signupData: ParticipantSignupDto): Promise<ParticipantLoginResponse> => {
  const { data } = await api.post<ParticipantLoginResponse>('/participant/signup', signupData);
  return data;
};

export const useParticipantSignup = () => {
  return useMutation({
    mutationFn: participantSignup,
    onSuccess: (data) => {
      // Assuming signup returns the same token structure as login for auto-login
      Cookies.set('access', data.accessToken);
      Cookies.set('refresh', data.refreshToken);
      setBearerToken(data.accessToken);
    },
  });
};

// Join Campaign
const joinCampaign = async (joinData: JoinCampaignDto): Promise<JoinCampaignResponse> => {
  const { data } = await api.post<JoinCampaignResponse>('/participant/join-campaign', joinData);
  return data;
};

export const useJoinCampaign = () => {
  return useMutation({
    mutationFn: joinCampaign,
  });
};
