import { Role } from '../enums/role';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
