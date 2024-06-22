import { OrderProduct } from './order-product.model';

export interface Order {
  id: number;
  userId: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
  creationDate: Date;
  lastUpdateDate: Date;
  orderProducts: OrderProduct[];
}
