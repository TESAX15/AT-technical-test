import { userRole } from '../../models/user.model';

export interface CreateUserDTO {
  email: string;
  password: string;
  userRole: userRole;
}
