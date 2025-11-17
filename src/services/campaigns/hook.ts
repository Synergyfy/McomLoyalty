import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../api';
import {
  CreateCampaignRequest,
  CampaignResponse,
  PaginatedCampaignsResponse,
} from './types';

const CAMPAIGNS_QUERY_KEY = 'campaigns';

// Create Campaign
const createCampaign = async (campaignData: CreateCampaignRequest): Promise<CampaignResponse> => {
  const { data } = await api.post<CampaignResponse>('/campaigns/business/campaigns', campaignData);
  return data;
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
  });
};

// Get All Campaigns By Business
const getAllCampaignsByBusiness = async (
  businessId: string,
  page: number,
  limit: number,
): Promise<PaginatedCampaignsResponse> => {
  const { data } = await api.get<PaginatedCampaignsResponse>(
    `/campaigns/business/${businessId}`,
    {
      params: { page, limit },
    },
  );
  return data;
};

export const useGetAllCampaignsByBusiness = (
  businessId: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, 'business', businessId, { page, limit }],
    queryFn: () => getAllCampaignsByBusiness(businessId, page, limit),
    enabled: !!businessId,
  });
};
