import express from 'express';
import { UserSignUpDTO } from '../dto/authentication/user-sign-up.dto';
import { authenticationService } from '../services/authentication.service';

async function signUp(req: express.Request, res: express.Response) {
  const userSignUpData: UserSignUpDTO = req.body;

  const responseContent = await authenticationService.signUpUser(userSignUpData);

  return res.status(responseContent.statusCode).send(responseContent);
}

export const authenticationController = {
  signUp
};
