export interface CreateOrderDTO {
  userId: number;
  orderProducts: { productId: number; quantity: number }[];
}
