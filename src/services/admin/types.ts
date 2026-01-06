export interface AdminParticipant {
  id: string;
  name: string;
  email: string;
  badgeLevel: string;
  location: string;
  activity: string;
  campaignsJoined: number;
  rewardsRedeemed: number;
  globalTotalPoints: number;
  matchingPoints: number;
  joinedDate: string;
}

export interface AdminBusiness {
  id: string;
  name: string;
  email: string;
  tier: string;
  sector: string;
  referralCapacity: number;
  activityStatus: string;
  campaignsCreated: number;
  rewardsAttached: number;
  pointsBalance: number;
  memberSince: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  imageUrl?: string;
}

export interface AdminBusinessDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string | null;
  website: string | null;
  socialMedia: string[]; // JSON says [], might be array of strings or objects? defaulting to string[] or any[] based on usage
  uniqueCode: string;
  role: string;
  referralCapacity: number;
  affiliateCode: string;
  referralPoints: string | number; // JSON has "0" (string), type definition likely number or string
  reputationPoints: string | number; // JSON has "0"
  profileImage: string | null;
  banner: string | null;
  isDisabled: boolean;
  stripeCustomerId: string | null;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  extraPoints: number;
  matchingPoints: number;
  isEmailVerified: boolean;
  locationTag: string | null;
  relationshipTag: string | null;
  sector: BaseEntity;
  category: BaseEntity;
  subCategory: BaseEntity;
}
