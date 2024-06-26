import express from 'express';
import { userService } from '../services/user.service';
import { AuthenticatedUserRequest } from '../interfaces/request/authenticated-user-request';
import { CreateUserDTO } from '../dto/user/create-user.dto';
import { UpdateUserDTO } from '../dto/user/update-user.dto';

/**
 * Function that extracts the necessary data from the request query to get all users and send them on the response
 * @param req http request containing the necesary data to get all users and the current authenticated user, contains the pagination parameters
 * @param res http response to be sent with the results of this function
 */
async function getAllUsers(req: AuthenticatedUserRequest, res: express.Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const responseContent = await userService.getAllUsers(page, limit);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request parameters to get a user by it's id and send it on the response
 * @param req http request containing the necesary parameters to get a user by it's id and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function getUserById(req: AuthenticatedUserRequest, res: express.Response) {
  const id = Number(req.params.id);
  const responseContent = await userService.getUserById(id);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request body to create a user and send it on the response
 * @param req http request containing the necesary data to create a user and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function createUser(req: AuthenticatedUserRequest, res: express.Response) {
  const createUserData: CreateUserDTO = req.body;

  const responseContent = await userService.createUser(createUserData);
  res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request body and parameters to update a user and send it on the response
 * @param req http request containing the necesary data to update a user and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function updateUserById(req: AuthenticatedUserRequest, res: express.Response) {
  const id = Number(req.params.id);
  const updateUserData: UpdateUserDTO = req.body;

  const responseContent = await userService.updateUser(id, updateUserData);
  res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request parameters to block a user
 * @param req http request containing the necesary data to block a user and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function blockUser(req: AuthenticatedUserRequest, res: express.Response) {
  const id = Number(req.params.id);

  const responseContent = await userService.blockUser(id);
  res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request parameters to unblock a user
 * @param req http request containing the necesary data to unblock a user and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function unblockUser(req: AuthenticatedUserRequest, res: express.Response) {
  const id = Number(req.params.id);

  const responseContent = await userService.unblockUser(id);
  res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request parameters to delete a user
 * @param req http request containing the necesary data to delete a user and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function deleteUserById(req: AuthenticatedUserRequest, res: express.Response) {
  const id = Number(req.params.id);
  const userId = req.authenticatedUser!.id;

  const responseContent = await userService.deleteUser(id, userId);
  res.status(responseContent.statusCode).send(responseContent);
}

export const userController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  blockUser,
  unblockUser,
  deleteUserById
};
