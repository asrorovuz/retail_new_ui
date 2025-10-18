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