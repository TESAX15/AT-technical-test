import { userRepository } from '../repositories/user.repository';
import { hashingUtil } from '../utils/hashing.util';
import { jwtAuthenticationUtil } from '../utils/jwt-authentication.util';
import { ResponseContentDTO } from '../dto/response-content/response-content.dto';
import { UserSignUpDTO } from '../dto/authentication/user-sign-up.dto';
import { UserLogInDTO } from '../dto/authentication/user-log-in.dto';

/**
 * Function that validates the business logic to sign up the user and uses a repository to create it
 * @param userSignUpData, the data sent from the controller to sign up the user
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function signUpUser(userSignUpData: UserSignUpDTO): Promise<ResponseContentDTO<void>> {
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

/**
 * Function that validates the business logic to log in  the user and uses a repository to create it
 * @param userSignUpData, the data sent from the controller to log in the user
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function logInUser(userLogInData: UserLogInDTO): Promise<ResponseContentDTO<string>> {
  try {
    const user = await userRepository.findUserByEmail(userLogInData.email);

    if (!user) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'No user with the email provided was found'
      };
    }

    // If the given password is the same as the hashed one it logs in the user, otherwise it denies the login
    if (await hashingUtil.compareHash(userLogInData.password, user.passwordHash)) {
      const token: string = jwtAuthenticationUtil.sign({
        id: user.id,
        email: user.email,
        userRole: user.userRole
      });

      return {
        statusCode: 200,
        statusMessage: 'OK',
        message: 'The user has successfully logged in',
        data: token
      };
    } else {
      return {
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'The email and password provided do not match'
      };
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The user could not be logged in due to an unexpected error'
    };
  }
}

export const authenticationService = {
  signUpUser,
  logInUser
};