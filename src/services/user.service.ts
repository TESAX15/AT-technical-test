import { userRepository } from '../repositories/user.repository';
import { paginationUtil } from '../utils/pagination.util';
import { hashingUtil } from '../utils/hashing.util';
import { numericIdValidation } from '../input-validation/numeric-id.validation';
import { userValidation } from '../input-validation/user.validation';
import { User } from '../models/user.model';
import { ResponseContentDTO } from '../dto/response-content/response-content.dto';
import { CreateUserDTO } from '../dto/user/create-user.dto';
import { UpdateUserDTO } from '../dto/user/update-user.dto';

/**
 * Function that validates the business logic to get all user with result pagination and uses a repository to find them in the DB
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
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
      isErrorMessage: false,
      message: 'The users have been found successfully',
      data: users,
      paginationPages: userPages
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      isErrorMessage: true,
      message: 'The users could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to get a user by it's id and uses a repository to find them in the DB
 * @param id, the id of the user to be found
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getUserById(id: number): Promise<ResponseContentDTO<User | null>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(id);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        isErrorMessage: true,
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
        isErrorMessage: false,
        message: 'The user has been found successfully',
        data: userById
      };
    } else {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        isErrorMessage: true,
        message: 'No user was found with the id provided'
      };
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      isErrorMessage: true,
      message: 'The user could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to create a user and uses a repository to create it in the DB
 * @param createUserData, the data sent from the controller to create a user
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function createUser(
  createUserData: CreateUserDTO
): Promise<ResponseContentDTO<Omit<User, 'passwordHash' | 'isBlocked'>>> {
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
        isErrorMessage: true,
        message:
          'The user could not be created due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const userEmailAlreadyExists = await userRepository.findUserByEmail(createUserData.email);

    if (userEmailAlreadyExists) {
      return {
        statusCode: 409,
        statusMessage: 'Conflict',
        isErrorMessage: true,
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
        isErrorMessage: false,
        message: 'The user has been created correctly',
        data: { id: createdUser.id, email: createdUser.email, userRole: createdUser.userRole }
      };
    } else {
      throw new Error('The user could not be created successfully');
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      isErrorMessage: true,
      message: 'The user could not be created due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to update a user and uses a repository to update it in the DB
 * @param updateUserData, the data sent from the controller to update a user
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function updateUser(
  id: number,
  updateUserData: UpdateUserDTO
): Promise<ResponseContentDTO<User>> {
  try {
    let validationErrors = numericIdValidation.validateNumericId(id);

    validationErrors = validationErrors.concat(
      userValidation.validateUserUpdateData({
        email: updateUserData.email,
        password: updateUserData.password,
        userRole: updateUserData.userRole,
        isBlocked: updateUserData.isBlocked
      })
    );

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        isErrorMessage: true,
        message:
          'The user could not be updated due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const userExists = await userRepository.findUserById(id);

    // Checking to see if a user with the id provided exists
    if (!userExists) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        isErrorMessage: true,
        message: 'No user was found with the id provided'
      };
    }

    const userEmailAlreadyExists = await userRepository.findUserByEmail(updateUserData.email);

    // Checking to see if a user with the provided email already exists and if that email is different from the one to update
    if (userEmailAlreadyExists && userExists.email != updateUserData.email) {
      return {
        statusCode: 409,
        statusMessage: 'Conflict',
        isErrorMessage: true,
        message: 'A user already exists with the email provided'
      };
    }

    const passwordHash = await hashingUtil.hashPassword(updateUserData.password);

    const updatedUser = await userRepository.updateUserById(id, {
      email: updateUserData.email,
      passwordHash: passwordHash,
      userRole: updateUserData.userRole,
      isBlocked: updateUserData.isBlocked
    });

    // Checking to see if the user was updated
    if (updatedUser) {
      return {
        statusCode: 200,
        statusMessage: 'OK',
        isErrorMessage: false,
        message: 'The user has been updated successfully',
        data: updatedUser
      };
    } else {
      throw new Error('The user was not updated successfully');
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      isErrorMessage: true,
      message: 'The user could not be updated due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to block a user and uses a repository to update the isBlocked field it in the DB
 * @param id, the id of the user to be blocked sent from the controller
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function blockUser(id: number): Promise<ResponseContentDTO<void>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(id);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        isErrorMessage: true,
        message:
          'The user could not be blocked due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const userExists = await userRepository.findUserById(id);

    // Checking to see if a user with the id provided exists
    if (!userExists) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        isErrorMessage: true,
        message: 'No user was found with the id provided'
      };
    }

    // Checking to see if the user with the id provided is already blocked
    if (userExists.isBlocked) {
      return {
        statusCode: 403,
        statusMessage: 'Forbidden',
        isErrorMessage: true,
        message: 'The user found with the id provided is already blocked'
      };
    }

    const blockedUser = await userRepository.blockUserById(id);

    // Checking to see if the user was blocked
    if (blockedUser.isBlocked) {
      return {
        statusCode: 200,
        statusMessage: 'OK',
        isErrorMessage: false,
        message: 'The user has been blocked successfully'
      };
    } else {
      throw new Error('The user was not blocked successfully');
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      isErrorMessage: true,
      message: 'The user could not be blocked due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to unblock a user and uses a repository to update the isBlocked field it in the DB
 * @param id, the id of the user to be unblocked sent from the controller
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function unblockUser(id: number): Promise<ResponseContentDTO<void>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(id);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        isErrorMessage: true,
        message:
          'The user could not be unblocked due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const userExists = await userRepository.findUserById(id);

    // Checking to see if a user with the id provided exists
    if (!userExists) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        isErrorMessage: true,
        message: 'No user was found with the id provided'
      };
    }

    // Checking to see if the user with the id provided is not blocked
    if (!userExists.isBlocked) {
      return {
        statusCode: 403,
        statusMessage: 'Forbidden',
        isErrorMessage: true,
        message: 'The user found with the id provided is not blocked'
      };
    }

    const unblockedUser = await userRepository.unblockUserById(id);

    // Checking to see if the user was unblocked
    if (!unblockedUser.isBlocked) {
      return {
        statusCode: 200,
        statusMessage: 'OK',
        isErrorMessage: false,
        message: 'The user has been unblocked successfully'
      };
    } else {
      throw new Error('The user was not unblocked successfully');
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      isErrorMessage: true,
      message: 'The user could not be unblocked due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to delete a user and uses a repository to delete it in the DB
 * @param id, the id of the user to be deleted sent from the controller
 *  * @param userId, the id of the user that is currently logged in, that has been validated by the authenticated user middleware
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function deleteUser(id: number, userId: number): Promise<ResponseContentDTO<void>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(id);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        isErrorMessage: true,
        message:
          'The user could not be deleted due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    if (id === userId) {
      return {
        statusCode: 409,
        statusMessage: 'Conflict',
        isErrorMessage: true,
        message: 'The user could not be deleted becasuse a user cannot delete itself'
      };
    }

    const userExists = await userRepository.findUserById(id);

    // Checking to see if a user with the id provided exists
    if (!userExists) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        isErrorMessage: true,
        message: 'No user was found with the id provided'
      };
    }

    const userHasMadeOrders = await userRepository.userHasMadeOrders(id);

    // If a user has orders in the DB then it can't be deleted because of the FK from order table to user table
    if (userHasMadeOrders) {
      return {
        statusCode: 409,
        statusMessage: 'Conflict',
        isErrorMessage: true,
        message: 'The user could not be deleted becasuse it has made orders before'
      };
    }

    const deletedUser = await userRepository.deleteUserById(id);

    // Checking to see if the user was deleted
    if (deletedUser) {
      return {
        statusCode: 200,
        statusMessage: 'OK',
        isErrorMessage: false,
        message: 'The user has been deleted successfully'
      };
    } else {
      throw new Error('The user was not deleted successfully');
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      isErrorMessage: true,
      message: 'The user could not be deleted due to an unexpected error'
    };
  }
}

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser
};
