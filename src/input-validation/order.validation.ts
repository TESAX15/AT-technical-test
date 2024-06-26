import z from 'zod';
import parseValidationData from '../utils/parse-validation-data.util';
import { CreateOrderDTO } from '../dto/order/create-order.dto';

function validateOrderProducts(orderProducts: Omit<CreateOrderDTO, 'userId'>): string[] {
  const createOrderDTOSchema = z.object({
    orderProducts: z
      .object({
        productId: z
          .number({
            required_error: 'a productId is required',
            invalid_type_error: 'a productId must be a number'
          })
          .min(1, { message: 'a productId must be greater than or equal to 1' }),
        quantity: z
          .number({
            required_error: 'a quantity is required',
            invalid_type_error: 'a quantity must be a number'
          })
          .min(1, { message: 'a quantity number must be greater than or equal to 1' })
      })
      .array()
      .min(1, { message: 'At least 1 order product is needed to create an order' })
  });

  return parseValidationData(orderProducts, createOrderDTOSchema);
}

export const orderValidation = {
  validateOrderProducts
};
