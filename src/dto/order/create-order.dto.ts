import { OrderProduct } from '../../models/order-product.model';

export interface CreateOrderDTO {
  userId: number;
  orderProducts: Omit<OrderProduct, 'orderId' | 'product'>[];
}
