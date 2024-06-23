import express from 'express';
import { jwtAuthenticationUtil } from '../utils/jwt-authentication.util';
import { AuthenticatedUser } from '../interfaces/authentication/authenticated-user';

// For now the only two user roles defined are Admin or non-Admin but similar functions could be implemented to check for different roles

/**
 *  Function to extract the JWT Token from cookies, verify it and checked if the user role is Admin
 * @param req, express Request
 * @param res, express Response
 * @param next, express Next function to be executed after this middleware
 */
export function isAuthorizedAdminUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Extracts the token from the cookies
  const token: string = req.cookies['authToken'];

  // If a token is found, it verifies the token and extracts the role to check if the logged in user is an admin
  if (token) {
    let authenticatedUser: AuthenticatedUser;

    // If the token verification throws an error it means the token is invalid
    try {
      authenticatedUser = jwtAuthenticationUtil.verifyAuthToken(token);
    } catch {
      return res.status(403).send('The auth token is invalid');
    }
    if (authenticatedUser.userRole === 'Admin') {
      next();
      return;
    } else {
      return res
        .status(403)
        .send('The user logged in does not have enough privileges to access this route');
    }
  } else {
    return res.status(404).send('There is no user logged in');
  }
}

export const authorizedUserMiddleware = {
  isAuthorizedAdminUser
};
