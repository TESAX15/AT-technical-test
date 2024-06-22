import express from 'express';
import { userService } from '../services/user.service';
import { CreateUserDTO } from '../dto/user/create-user.dto';

/**
 * Function that extracts the necessary data from the request query to get all users and send them on the response
 * @param req http request containing the necesary data to get all users
 * @param res http response to be sent with the results of this function
 */
async function getAllUsers(req: express.Request, res: express.Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const responseContent = await userService.getAllUsers(page, limit);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request params to get a user by it's id and send it on the response
 * @param req http request containing the necesary data to get a user by it's id
 * @param res http response to be sent with the results of this function
 */
async function getUserById(req: express.Request, res: express.Response) {
  const id = Number(req.params.id);
  const responseContent = await userService.getUserById(id);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request body to create a user and send it on the response
 * @param req http request containing the necesary data to create a user
 * @param res http response to be sent with the results of this function
 */
async function createUser(req: express.Request, res: express.Response) {
  const createUserData: CreateUserDTO = req.body;

  const responseContent = await userService.createUser(createUserData);
  res.status(responseContent.statusCode).send(responseContent);
}

export const userController = {
  getAllUsers,
  getUserById,
  createUser
};
