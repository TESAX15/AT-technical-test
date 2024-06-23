import { PrismaClient } from '@prisma/client';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

async function createUser(user: Omit<User, 'id' | 'isBlocked'>): Promise<User> {
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

async function updateUserById(id: number, updateUserData: Omit<User, 'id'>): Promise<User> {
  return (await prisma.user.update({
    where: {
      id
    },
    data: updateUserData
  })) as User;
}

async function blockUserById(id: number): Promise<User> {
  return (await prisma.user.update({
    where: {
      id
    },
    data: {
      isBlocked: true
    }
  })) as User;
}

async function unblockUserById(id: number): Promise<User> {
  return (await prisma.user.update({
    where: {
      id
    },
    data: {
      isBlocked: false
    }
  })) as User;
}

async function userHasMadeOrders(id: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      orders: true
    }
  });
  if (user?.orders.length) {
    return true;
  } else {
    return false;
  }
}

async function deleteUserById(id: number): Promise<boolean> {
  const user = await prisma.user.delete({
    where: {
      id
    }
  });
  if (user) {
    return true;
  } else {
    return false;
  }
}

export const userRepository = {
  createUser,
  countUsers,
  findUserById,
  findUserByEmail,
  findPaginatedUsers,
  updateUserById,
  blockUserById,
  unblockUserById,
  userHasMadeOrders,
  deleteUserById
};
