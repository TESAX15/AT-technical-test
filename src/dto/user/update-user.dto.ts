import { userRole } from '../../models/user.model';

export interface UpdateUserDTO {
  email: string;
  password: string;
  userRole: userRole;
  isBlocked: boolean;
}
