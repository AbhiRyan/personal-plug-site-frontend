import { AuthenticationResponceDto } from "./authenticationResponceDto";

export interface User extends AuthenticationResponceDto {
  notes?: string[];
}
