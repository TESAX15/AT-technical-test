import { PrismaClient } from '@prisma/client';
import { Order } from '../models/order.model';
import { OrderProduct } from '../models/order-product.model';

const prisma = new PrismaClient();

async function createOrder(
  order: Omit<Order, 'id' | 'creationDate' | 'orderProducts'>,
  orderProducts: Omit<OrderProduct, 'orderId' | 'product'>[]
): Promise<Order> {
  return (await prisma.order.create({
    data: {
      userId: order.userId,
      orderStatus: order.orderStatus,
      lastUpdateDate: order.lastUpdateDate,
      orderProducts: {
        createMany: {
          data: orderProducts
        }
      }
    },
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  })) as Order;
}

async function countOrders(): Promise<number> {
  return await prisma.order.count();
}

async function findPaginatedOrders(skip: number, take: number): Promise<Order[]> {
  return (await prisma.order.findMany({
    skip,
    take,
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  })) as Order[];
}

export const orderRepository = {
  createOrder,
  countOrders,
  findPaginatedOrders
};
