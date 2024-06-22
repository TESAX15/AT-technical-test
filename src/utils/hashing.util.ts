import bcrypt from 'bcrypt';

// Rounds of salt to be applied in the hashing
const saltRounds = 10;

// Function to hash a password
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

// Function to compare the user provided password to the stored password hash
async function compareHash(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export const hashingUtil = {
  hashPassword,
  compareHash
};
