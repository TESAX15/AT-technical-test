import express from 'express';
import { userService } from '../services/user.service';

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

export const userController = {
  getAllUsers
};
