import z from 'zod';
import parseValidationData from '../utils/parse-validation-data.util';
import { Product } from '../models/product.model';

function validateProductAttributes(product: Omit<Product, 'id'>): string[] {
  const productSchema = z.object({
    name: z
      .string({
        required_error: 'a name is required',
        invalid_type_error: 'the name provided is not a string'
      })
      .min(1, { message: 'the name cannot be empty' }),
    description: z
      .string({
        required_error: 'a description is required',
        invalid_type_error: 'the description provided is not a string'
      })
      .min(1, { message: 'the description cannot be empty' }),
    price: z
      .number({
        required_error: 'a price is required',
        invalid_type_error: 'the price provided is not a number'
      })
      .min(0.01, { message: 'the price number provided must be greater than or equal to 0.01' }),
    availableStock: z
      .number({
        required_error: 'a availableStock is required',
        invalid_type_error: 'the availableStock provided is not a number'
      })
      .min(1, { message: 'the availableStock number provided must be greater than or equal to 1' })
  });
  return parseValidationData(product, productSchema);
}

export const productValidation = {
  validateProductAttributes
};
