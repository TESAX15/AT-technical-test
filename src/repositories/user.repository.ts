import { PrismaClient } from '@prisma/client';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

async function createUser(user: Omit<User, 'id' | 'blocked'>) {
  return (await prisma.user.create({ data: user })) as User;
}

async function findUserById(id: number) {
  return await prisma.user.findUnique({ where: { id: id } });
}

async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email: email } });
}

export const userRepository = {
  createUser,
  findUserById,
  findUserByEmail
};
