import { User } from './user';

export interface AuthenticationResponceDto {
  token: string;
  userDto: User;
}
