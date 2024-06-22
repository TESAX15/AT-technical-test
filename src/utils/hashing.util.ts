import bcrypt from 'bcrypt';

// Rounds of salt to be applied in the hashing
const saltRounds = 10;

// Function to hash a password
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export const hashingUtil = {
  hashPassword
};
