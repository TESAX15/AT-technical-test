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

export const orderRepository = {
  createOrder
};
