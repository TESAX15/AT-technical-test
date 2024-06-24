import { PrismaClient } from '@prisma/client';
import { Order, OrderStatus } from '../models/order.model';
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

async function countUserOrders(userId: number): Promise<number> {
  return await prisma.order.count({ where: { userId: userId } });
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

async function findPaginatedUserOrders(
  skip: number,
  take: number,
  userId: number
): Promise<Order[]> {
  return (await prisma.order.findMany({
    skip,
    take,
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    },
    where: {
      userId: userId
    }
  })) as Order[];
}

async function findOrderById(id: number): Promise<Order | null> {
  return (await prisma.order.findUnique({
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    },
    where: { id: id }
  })) as Order;
}

async function updateOrderStatus(id: number, orderStatus: OrderStatus): Promise<Order> {
  return (await prisma.order.update({
    data: { orderStatus: orderStatus },
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    },
    where: { id: id }
  })) as Order;
}

export const orderRepository = {
  createOrder,
  countOrders,
  countUserOrders,
  findPaginatedOrders,
  findPaginatedUserOrders,
  findOrderById,
  updateOrderStatus
};
