import { PrismaClient } from '@prisma/client';
import { Product } from '../models/product.model';

const prisma = new PrismaClient();

async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  return await prisma.product.create({
    data: product
  });
}

async function countProducts(): Promise<number> {
  return await prisma.product.count();
}

async function countAvailableProducts(): Promise<number> {
  return await prisma.product.count({ where: { availableStock: { gt: 0 } } });
}

async function findPaginatedProducts(skip: number, take: number): Promise<Product[]> {
  return await prisma.product.findMany({
    skip,
    take
  });
}

async function findPaginatedAvailableProducts(skip: number, take: number): Promise<Product[]> {
  return await prisma.product.findMany({
    skip,
    take,
    where: { availableStock: { gt: 0 } }
  });
}

async function findProductById(id: number): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: {
      id
    }
  });
}

async function findProductByName(name: string): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: {
      name
    }
  });
}

export const productRepository = {
  createProduct,
  countProducts,
  countAvailableProducts,
  findPaginatedProducts,
  findPaginatedAvailableProducts,
  findProductById,
  findProductByName
};
