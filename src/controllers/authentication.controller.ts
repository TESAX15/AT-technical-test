import express from 'express';
import { authenticationService } from '../services/authentication.service';
import { UserSignUpDTO } from '../dto/authentication/user-sign-up.dto';
import { UserLogInDTO } from '../dto/authentication/user-log-in.dto';

/**
 * Function that extracts the necessary data from the request body to sign up the user and sends it on the response
 * @param req http request containing the necesary data to sign up the user
 * @param res http response to be sent with the results of this function
 */
async function signUp(req: express.Request, res: express.Response) {
  const userSignUpData: UserSignUpDTO = req.body;

  const responseContent = await authenticationService.signUpUser(userSignUpData);

  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request body to log in the user and sends the jwt token on the response
 * @param req http request containing the necesary data to log in the user
 * @param res http response to be sent with the results of this function
 */
async function logIn(req: express.Request, res: express.Response) {
  const userLoginData: UserLogInDTO = req.body;

  // If theres a user already logged in it does not allow someone else to log on
  if (req.cookies['authToken']) {
    return res.status(401).send({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'A user is already logged in'
    });
  }

  const responseContent = await authenticationService.logInUser(userLoginData);

  // If the user is correctly logged in, it saves an Authentication Token that works for any path inside localhost
  if (responseContent.statusCode == 200) {
    res.cookie('authToken', responseContent.data, {
      domain: 'localhost',
      path: '/',
      httpOnly: true
    });
  }

  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request cookies to log out the user and send a response
 * @param req http request containing the necesary data to log out the user
 * @param res http response to be sent with the results of this function
 */
async function logout(req: express.Request, res: express.Response) {
  // If theres no user logged in it does not allow a log out
  if (!req.cookies['authToken']) {
    return res.status(404).send({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'There is no user logged in'
    });
  }

  // If a user is logged in then it clears the authentication token
  res.clearCookie('authToken');

  return res.status(200).send({
    statusCode: 200,
    statusMessage: 'OK',
    message: 'The user has successfully logged out'
  });
}

export const authenticationController = {
  signUp,
  logIn,
  logout
};
