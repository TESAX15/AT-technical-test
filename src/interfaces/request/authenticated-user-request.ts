import { Request } from 'express';
import { AuthenticatedUser } from '../authentication/authenticated-user';

export interface AuthenticatedUserRequest extends Request {
  authenticatedUser?: AuthenticatedUser;
}
