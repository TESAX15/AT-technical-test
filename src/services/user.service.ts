import { userRepository } from '../repositories/user.repository';
import { paginationUtil } from '../utils/pagination.util';
import { User } from '../models/user.model';
import { ResponseContentDTO } from '../dto/response-content/response-content.dto';

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
      message: 'The products could not be found due to an unexpected error'
    };
  }
}

export const userService = {
  getAllUsers
};
