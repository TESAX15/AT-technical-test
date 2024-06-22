import { userRepository } from '../repositories/user.repository';
import { paginationUtil } from '../utils/pagination.util';
import { hashingUtil } from '../utils/hashing.util';
import { numericIdValidation } from '../input-validation/numeric-id.validation';
import { userValidation } from '../input-validation/user.validation';
import { User } from '../models/user.model';
import { ResponseContentDTO } from '../dto/response-content/response-content.dto';
import { CreateUserDTO } from '../dto/user/create-user.dto';

async function getAllUsers(page: number, limit: number): Promise<ResponseContentDTO<User[]>> {
  try {
    const userCount = await userRepository.countUsers();
    const paginationParams = paginationUtil.validatePaginationParams(page, limit);
    // Calculates the pagination based on the validated parameters
    const userPages = paginationUtil.calculatePages(
      userCount,
      paginationParams.page,
      paginationParams.limit
    );
    const users = await userRepository.findPaginatedUsers(
      paginationParams.skip,
      paginationParams.limit
    );
    return {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'The users have been found successfully',
      data: users,
      paginationPages: userPages
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The users could not be found due to an unexpected error'
    };
  }
}

async function getUserById(id: number): Promise<ResponseContentDTO<User | null>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(id);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'No user could be found due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const userById = await userRepository.findUserById(id);

    if (userById) {
      return {
        statusCode: 200,
        statusMessage: 'OK',
        message: 'The user has been found successfully',
        data: userById
      };
    } else {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'No user was found with the id provided'
      };
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The user could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to create a user and uses a repository to create it in the DB
 * @param createUserData, the data sent from the controller to create a user
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function createUser(createUserData: CreateUserDTO): Promise<ResponseContentDTO<void>> {
  try {
    const validationErrors = userValidation.validateUserCreationData({
      email: createUserData.email,
      password: createUserData.password,
      userRole: createUserData.userRole
    });

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'The user could not be created due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const userAlreadyExists = await userRepository.findUserByEmail(createUserData.email);

    if (userAlreadyExists) {
      return {
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'A user already exists with this email'
      };
    }

    const passwordHash = await hashingUtil.hashPassword(createUserData.password);

    const createdUser = await userRepository.createUser({
      email: createUserData.email,
      passwordHash: passwordHash,
      userRole: createUserData.userRole
    });

    if (createdUser) {
      return {
        statusCode: 201,
        statusMessage: 'Created',
        message: 'The user has been created correctly'
      };
    } else {
      throw new Error('The user could not be created successfully');
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The user could not be created due to an unexpected error'
    };
  }
}

export const userService = {
  getAllUsers,
  getUserById,
  createUser
};
