import { PrismaClient } from '@prisma/client';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

async function createUser(user: Omit<User, 'id' | 'blocked'>): Promise<User> {
  return (await prisma.user.create({ data: user })) as User;
}

async function countUsers(): Promise<number> {
  return await prisma.user.count();
}

async function findUserById(id: number): Promise<User | null> {
  return (await prisma.user.findUnique({ where: { id: id } })) as User;
}

async function findUserByEmail(email: string): Promise<User | null> {
  return (await prisma.user.findUnique({ where: { email: email } })) as User;
}

async function findPaginatedUsers(skip: number, take: number): Promise<User[]> {
  return (await prisma.user.findMany({
    skip,
    take
  })) as User[];
}

export const userRepository = {
  createUser,
  countUsers,
  findUserById,
  findUserByEmail,
  findPaginatedUsers
};
