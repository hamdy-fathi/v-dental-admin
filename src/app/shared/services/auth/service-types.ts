import { User } from '@pages/users/services/services-type';

// Auth service types (Models/entities)
export interface LoginData {
  access_token: string;
  token_type: string;
  refreshToken: string;
  user: User;
}
