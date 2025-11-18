import { Campaign } from '../campaigns/types';

export interface TopBusiness {
  id: string;
  name: string;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
}

export interface SystemOverview {
  totalCampaigns: number;
  totalParticipants: number;
  totalRedemptions: number;
  totalBusiness: number;
  totalMatchingPoints: number;
}

export interface TopReward {
  id: string;
  name: string;
  totalRedemptions: number;
}

export interface CampaignAnalyticsDto {
  name: string;
  sector: string;
  status: 'Active' | 'Ended' | 'Upcoming' | 'Disabled';
  total_participants: number;
  total_reward_redeemed: number;
  total_point_awarded: number;
  redemption_rate: number;
}

export interface PaginatedAnalyticsResponse {
  data: CampaignAnalyticsDto[];
  total: number;
  page: number;
  limit: number;
  next_page: number | null;
}
