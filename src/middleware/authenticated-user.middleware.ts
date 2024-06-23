import express from 'express';
import { jwtAuthenticationUtil } from '../utils/jwt-authentication.util';
import { AuthenticatedUser } from '../interfaces/authentication/authenticated-user';
import { AuthenticatedUserRequest } from '../interfaces/request/authenticated-user-request';
import { userRepository } from '../repositories/user.repository';

/**
 *  Function to extract the JWT Token from cookies, verify it and save the authenticated user in it to the Request
 * @param req, custom express Request extension to include an attribute to store the authenticated user
 * @param res, express Response
 * @param next, express Next function to be executed after this middleware
 */
export async function isAuthenticatedUser(
  req: AuthenticatedUserRequest,
  res: express.Response,
  next: express.NextFunction
) {
  // Extracts the token from the cookies
  const token: string = req.cookies['authToken'];

  // If a token is not found, it means there's no user logged in
  if (!token) {
    return res.status(404).send('There is no authenticated user logged in');
  }

  let authenticatedUser: AuthenticatedUser;

  // If the token verification throws an error it means the token is invalid
  try {
    authenticatedUser = jwtAuthenticationUtil.verifyAuthToken(token);
  } catch {
    return res.status(403).send('The auth token provided is invalid');
  }

  const userExists = await userRepository.findUserById(authenticatedUser.id);

  // Check to see if a user exists with the id obtained from the token
  if (!userExists) {
    return res.status(404).send('The user does not exist');
  }

  // Stores the authenticated user inside the request
  req.authenticatedUser = authenticatedUser;

  next();
  return;
}

export const authenticatedUserMiddleware = {
  isAuthenticatedUser
};
