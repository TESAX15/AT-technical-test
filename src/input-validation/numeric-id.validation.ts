import z from 'zod';
import parseValidationData from '../utils/parse-validation-data.util';

function validateNumericId(id: number): string[] {
  const idSchema = z
    .number({
      required_error: 'an id is required',
      invalid_type_error: 'the id provided is not a number'
    })
    .min(1, { message: 'the id provided must be greater than or equal to 1' });
  return parseValidationData(id, idSchema);
}

export const numericIdValidation = {
  validateNumericId
};
