import jsonwebtoken from 'jsonwebtoken';
import { env } from '../env-configuration/env-variables-configuration';
import { AuthenticatedUser } from '../interfaces/authentication/authenticated-user';

/**
 * Function signs a payload to generate a token
 * @param payload the payload to be signed
 * @returns the token generated after signing the payload
 */
function sign(payload: string | Buffer | object): string {
  const secret = env.JWT_SECRET;
  const expirationTime = env.JWT_EXPIRATION_TIME;

  return jsonwebtoken.sign(payload, secret, { expiresIn: expirationTime });
}

/**
 * Function that verifies an authenticated user token and returns the original payload
 * @param token the authenticated user token to be verified
 * @returns the authenticated user that was signed when creating the token
 */
function verifyAuthToken(token: string): AuthenticatedUser {
  const secret = env.JWT_SECRET;
  const decodedPayload = jsonwebtoken.verify(token, secret);

  return decodedPayload as AuthenticatedUser;
}

export const jwtAuthenticationUtil = {
  sign,
  verifyAuthToken
};
