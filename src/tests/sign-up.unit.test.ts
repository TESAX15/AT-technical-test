import { authenticationService } from '../services/authentication.service';
import { userRepository } from '../repositories/user.repository';

jest.mock('../repositories/user.repository');

const userCredentialsData = {
  email: 'test.user@gmail.com',
  password: 'contra123.'
};

const userFromDB = {
  id: 1,
  email: userCredentialsData.email,
  passwordHash: '$2b$10$4j5NKkx0WWJOtqjE6zOGq.nhSfOWaeJydHkI7gWKCywWBkg/wcdGe',
  userRole: 'NonAdmin',
  isBlocked: false
};

describe('Sign Up Test', () => {
  const findUserByEmailMock = userRepository.findUserByEmail as jest.Mock;
  const createUserMock = userRepository.createUser as jest.Mock;

  it('Should return a user has been signed up correctly response', async () => {
    // Mocking a null value means no user was found with the email provided
    findUserByEmailMock.mockResolvedValue(null);

    // Mocking to simulate the creation of the user
    createUserMock.mockResolvedValue(userFromDB);

    const responseContent = await authenticationService.signUpUser(userCredentialsData);

    expect(responseContent.isErrorMessage).toBe(false);
    expect(responseContent.statusCode).toBe(201);
  });

  it('Should return a user already exists with this email response', async () => {
    // Mocking a user return value means a user was found with the email provided
    findUserByEmailMock.mockResolvedValue(userFromDB);

    const responseContent = await authenticationService.signUpUser(userCredentialsData);

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(409);
    expect(responseContent.message).toBe('A user already exists with this email');
  });

  it('Should return a validation errors response', async () => {
    const responseContent = await authenticationService.signUpUser({
      email: 'invalidEmail',
      password: ''
    });

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toContain(
      'The user could not be signed up due to the following validation errors:'
    );
  });
});
