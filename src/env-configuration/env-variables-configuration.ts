import z from 'zod';

// The interface to be used by the verified env variables
interface EnvVariables {
  PORT: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
}

// The ZOD schema to verify the env variables
const envSchema = z.object({
  PORT: z
    .number({
      invalid_type_error: 'the PORT provided is not a number'
    })
    .min(1, { message: 'the PORT number provided must be greater than or equal to 1' })
    .max(65535, {
      message: 'the PORT number is required and provided must be lesser than or equal to 65535'
    }),
  DATABASE_URL: z
    .string()
    .startsWith('postgresql://', {
      message: 'the DATABASE_URL must start with the protocol `postgresql://`'
    })
    .min(1, { message: 'a DATABASE_URL is required' }),
  JWT_SECRET: z
    .string()
    .min(32, { message: 'a JWT_SECRET is required and should be at least 32 characters long' }),
  JWT_EXPIRATION_TIME: z
    .number({
      invalid_type_error: 'the JWT_EXPIRATION_TIME provided is not a number'
    })
    .min(0.0001, {
      message:
        'a JWT_EXPIRATION_TIME number is required and provided must be greater than or equal to 0.01'
    })
});

// Initializing env variables to be used by the API
export const env = {} as EnvVariables;

let verifiedEnv: z.infer<typeof envSchema>;

/**
 * Function that initializes that ensures the enviroment variables are valid and makes them available to the api
 */
export function initializeEnvVariables() {
  //if the verification is successful, the env variable has its values set
  if (validateEnvVariables()) {
    env.PORT = verifiedEnv.PORT.toString();
    env.DATABASE_URL = verifiedEnv.DATABASE_URL;
    env.JWT_SECRET = verifiedEnv.JWT_SECRET;
    env.JWT_EXPIRATION_TIME = verifiedEnv.JWT_EXPIRATION_TIME.toString() + 'h';
  }
}

/**
 * Function that validates the enviroment variables
 */
function validateEnvVariables(): boolean {
  const validationErrors: string[] = [];

  // An object is created with PORT and JWT_EXPIRATION_TIME as numbers to verify their values and ensure the only unit used for JWT_EXPIRATION_TIME is hours
  const envToVerify = {
    PORT: Number(process.env.PORT),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION_TIME: Number(process.env.JWT_EXPIRATION_TIME)
  };

  try {
    // The object created previously is verified
    verifiedEnv = envSchema.parse(envToVerify);
    if (verifiedEnv) {
      return true;
    } else return false;
  } catch (error) {
    // All the errors are inserted into the validation errors array
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        validationErrors.push(issue.message);
      });
    }
    throw new Error(
      'The enviroment variables have the following validation errors: ' + validationErrors
    );
  }
}
