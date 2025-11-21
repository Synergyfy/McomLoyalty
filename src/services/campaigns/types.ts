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
  QR_CODE = 'qr_code',
  LINK = 'link',
  BOTH = 'both',
  REFERRAL = 'referral',
}

export enum AudienceType {
  ALL = 'all',
  MEMBERS = 'members',
}

export interface Reward {
  id: string;
  title: string;
  points_required: number;
  value: number;
  description: string;
  image: string;
  quantity: number;
  disabled: boolean;
}

export interface PublicCampaignResponse {
  id: string;
  name: string;
  campaign_type: string; // API returns string, but we can map to enum if needed
  campaign_message: string;
  start_date: string;
  end_date: string;
  quantity: number;
  audience_type: string;
  banner_url: string;
  logo_url: string | null;
  cta_text: string;
  cta_background_color: string;
  cta_text_color: string;
  text_color: string;
  background_color: string;
  disabled: boolean;
  rewards: Reward[];
  uniqueCode?: string; // Present in my-created-campaigns example
}

export interface Business {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  socialMedia?: string[];
  uniqueCode?: string;
  role?: string;
  referralCapacity?: number;
  affiliateCode?: string;
  referralPoints?: string;
  reputationPoints?: string;
  isDisabled?: boolean;
  stripeCustomerId?: string | null;
}

export interface BusinessCampaign {
  id: string;
  uniqueCode: string;
  business: Business;
  campaign: PublicCampaignResponse;
}

export interface PaginatedCampaignsResponse {
  data: PublicCampaignResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CampaignAnalytics {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  disabled: boolean;
  sector: string | null;
  status: 'active' | 'inactive';
  totalParticipants: string;
  totalPointsAwarded: string;
  totalRewardsRedeemed: string;
  redemptionRate: number;
}

export interface PaginatedCampaignAnalyticsResponse {
  data: CampaignAnalytics[];
  total: number;
  page: number;
  limit: number;
}

export interface WeeklyChartData {
  date: string;
  pointsAwarded: string;
  rewardsRedeemed: string;
  newParticipants: string;
}

export interface RankedParticipant {
  id: string;
  pName: string;
  pEmail: string;
  totalPointsEarned: string;
  totalRedemptions: string;
}

export interface TopReward {
  id: string;
  rTitle: string;
  rPointsRequired: number;
  totalRedemptions: string;
}

export interface DetailedCampaignAnalytics {
  totalParticipants: string;
  totalRewardsRedeemed: string;
  totalPointsAwarded: string | null;
  redemptionRate: number;
  weeklyChartData: WeeklyChartData[];
  rankedParticipants: RankedParticipant[];
  topRewards: TopReward[];
}

export enum PointHistoryType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  MATCHING = 'MATCHING',
}

export interface CustomerActivityResponseDto {
  participantName: string;
  participantId?: string;
  activityType: PointHistoryType;
  details: string;
  campaignName: string;
  date: Date;

}

export interface PaginatedCustomerActivityResponseDto {
  data: CustomerActivityResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CampaignDetailReward {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  pointsRequired?: number;
  points_required?: number;
  value?: number | string;
  image?: string;
  image_url?: string;
  quantity?: number;
}

export interface PublicCampaignDetailResponse {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  name: string;
  campaignType?: string;
  campaignMessage?: string;
  startDate?: string;
  endDate?: string;
  quantity?: number;
  audienceType?: string | string[];
  bannerUrl?: string;
  logoUrl?: string | null;
  ctaText?: string;
  ctaBackgroundColor?: string;
  ctaTextColor?: string;
  disabled?: boolean;
  textColor?: string;
  backgroundColor?: string;
  signUpPoint?: number | null;
  totalPointsEarned?: number;
  totalPointsRedeemed?: number;
  rewardType?: string;
  regularPointsThreshold?: number | null;
  matchingPointsThreshold?: number | null;
  totalMatchingPointsEarned?: number;
  matchingPointsDisabledByAdmin?: boolean;
  uniqueCode?: string | null;
  earnPointPageTitle?: string | null;
  earnPointPageDescription?: string | null;
  redeemRewardPageTitle?: string | null;
  redeemRewardPageDescription?: string | null;
  contactUsPageTitle?: string | null;
  contactUsPageDescription?: string | null;
  contactEmail?: string | null;
  contactPhoneNumber?: string | null;
  footerText?: string | null;
  business?: Business;
  rewards?: CampaignDetailReward[];
}
