export interface ParticipantSignupDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  location?: string;
  birthday?: string;
  gender?: string;
}

export interface ParticipantLoginDto {
  email: string;
  password: string;
}

export interface ParticipantLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface JoinCampaignDto {
  campaignId: string;
}

export interface JoinCampaignResponse {
  message: string;
  membershipId?: string;
}
