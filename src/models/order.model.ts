import { OrderProduct } from './order-product.model';

export interface Order {
  id: number;
  userId: number;
  orderStatus: OrderStatus;
  creationDate: Date;
  lastUpdateDate: Date;
  orderProducts: OrderProduct[];
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
