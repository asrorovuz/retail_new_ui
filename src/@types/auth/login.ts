export type StatusResponse = { is_registered: boolean };

export type LoginPayload = {
  username: string;
  password: string;
  certificate?: string | null;
};

export type LoginResponse = {
  id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  type: number;
  name: string;
  username: string;
};

export type GlobalLogin = {
  username: string;
  password: string;
};

export type Organizationtype = {
  token: string;
  organizations: {
    id: string | number;
    inn: string;
    name: string;
    pinfl: string;
    organization_code: string;
  }[];
};
