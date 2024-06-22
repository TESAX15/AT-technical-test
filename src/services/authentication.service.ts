import { userRepository } from '../repositories/user.repository';
import { hashingUtil } from '../utils/hashing.util';
import { UserSignUpDTO } from '../dto/authentication/user-sign-up.dto';
import { ResponseContentDTO } from '../dto/response-content/response-content.dto';

async function signUpUser(userSignUpData: UserSignUpDTO): Promise<ResponseContentDTO> {
  try {
    const userAlreadyExists = await userRepository.findUserByEmail(userSignUpData.email);

    if (userAlreadyExists) {
      return {
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'A user already exists with this email'
      };
    }

    const passwordHash = await hashingUtil.hashPassword(userSignUpData.password);

    const createdUser = await userRepository.createUser({
      email: userSignUpData.email,
      passwordHash: passwordHash,
      userRole: 'Non-Admin'
    });

    if (createdUser) {
      return {
        statusCode: 201,
        statusMessage: 'Created',
        message: 'The user has been signed up correctly'
      };
    } else {
      throw new Error('The user could not be signed up successfully');
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The user could not be signed up due to an unexpected error'
    };
  }
}

export const authenticationService = {
  signUpUser
};
