export interface CreateCampaignRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  rewardId: string;
  thumbnailUrl: string;
  subImageUrls: string[];
}

export interface CampaignResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  rewardId: string;
  thumbnailUrl: string;
  subImageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export enum CampaignType {
  QR_CODE = 'QR_CODE',
  LINK = 'LINK',
  BOTH = 'BOTH',
}

export enum AudienceType {
  ALL = 'ALL',
  MEMBERS = 'MEMBERS',
}

export interface Campaign {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  name: string;
  campaign_type: CampaignType;
  campaign_message: string;
  start_date: Date;
  end_date: Date;
  quantity: number;
  audience_type: AudienceType;
  disabled: boolean;
  banner_url: string;
  cta_text: string;
  cta_background_color: string;
  cta_text_color: string;
  text_color: string;
  background_color: string;
  total_points_earned: number;
  total_points_redeemed: number;
  business: Business; // Relation
  rewards: Reward[]; // Relation
}

// Simplified representation of related entities
export interface Business {
  id: string;
  name: string;
  email: string;
  logoUrl?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
}

// The structure of the paginated response
export interface PaginatedCampaignsResponse {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
}
