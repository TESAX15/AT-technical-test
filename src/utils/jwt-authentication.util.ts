import jsonwebtoken from 'jsonwebtoken';
import { env } from '../env-configuration/env-variables-configuration';

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

export const jwtAuthenticationUtil = {
  sign
};
