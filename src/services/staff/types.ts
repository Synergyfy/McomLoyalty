export interface CreateStaffDto {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {}

export interface Staff {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffLoginDto {
  email: string;
  password: string;
}

export interface StaffLoginResponse {
  access_token: string;
  refresh_token: string;
}
