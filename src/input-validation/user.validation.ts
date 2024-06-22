import z from 'zod';
import parseValidationData from '../utils/parse-validation-data.util';
import { User } from '../models/user.model';

function validateUserCredentials(
  user: Omit<User, 'id' | 'passwordHash' | 'userRole' | 'blocked'> & { password: string }
): string[] {
  const userSignUpSchema = z.object({
    email: z
      .string({
        required_error: 'an email is required',
        invalid_type_error: 'the email provided is not a string'
      })
      .email({ message: 'the email provided is invalid' }),
    password: z
      .string({
        required_error: 'a password is required',
        invalid_type_error: 'the password provided is not a string'
      })
      .min(8, { message: 'the password should be at least 8 characters long' })
  });
  return parseValidationData(user, userSignUpSchema);
}

export const userValidation = {
  validateUserCredentials
};
