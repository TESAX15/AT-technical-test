import { productRepository } from '../repositories/product.repository';
import { paginationUtil } from '../utils/pagination.util';
import { productValidation } from '../input-validation/product.validation';
import { Product } from '../models/product.model';
import { ResponseContentDTO } from '../dto/response-content/response-content.dto';
import { CreateProductDTO } from '../dto/product/create-product.dto';
import { numericIdValidation } from '../input-validation/numeric-id.validation';

/**
 * Function that validates the business logic to get all products with result pagination and uses a repository to find them in the DB
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getAllProducts(page: number, limit: number): Promise<ResponseContentDTO<Product[]>> {
  try {
    const productCount = await productRepository.countProducts();
    const paginationParams = paginationUtil.validatePaginationParams(page, limit);
    // Calculates the pagination based on the validated parameters
    const productPages = paginationUtil.calculatePages(
      productCount,
      paginationParams.page,
      paginationParams.limit
    );
    const products = await productRepository.findPaginatedProducts(
      paginationParams.skip,
      paginationParams.limit
    );
    return {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'The products have been found successfully',
      data: products,
      paginationPages: productPages
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The products could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to get all available products with result pagination and uses a repository to find them in the DB
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getAvailableProducts(
  page: number,
  limit: number
): Promise<ResponseContentDTO<Product[]>> {
  try {
    const availableProductCount = await productRepository.countAvailableProducts();
    const paginationParams = paginationUtil.validatePaginationParams(page, limit);
    // Calculates the pagination based on the validated parameters
    const availableProductPages = paginationUtil.calculatePages(
      availableProductCount,
      paginationParams.page,
      paginationParams.limit
    );
    const availableProducts = await productRepository.findPaginatedAvailableProducts(
      paginationParams.skip,
      paginationParams.limit
    );
    return {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'The available products have been found successfully',
      data: availableProducts,
      paginationPages: availableProductPages
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The products could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to get a product by it's id and uses a repository to find them in the DB
 * @param id, the id of the product to be found
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getProductById(id: number): Promise<ResponseContentDTO<Product>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(id);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'No product could be found due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const productById = await productRepository.findProductById(id);

    if (productById) {
      return {
        statusCode: 200,
        statusMessage: 'OK',
        message: 'The product has been found successfully',
        data: productById
      };
    }
    return {
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'No product was found with the id provided'
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The product could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to create a product and uses a repository to create it in the DB
 * @param createProductData, the data sent from the controller to create a product
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function createProduct(
  createProductData: CreateProductDTO
): Promise<ResponseContentDTO<Product>> {
  try {
    const validationErrors = productValidation.validateProductAttributes({
      name: createProductData.name,
      description: createProductData.description,
      price: createProductData.price,
      availableStock: createProductData.availableStock
    });

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'The product could not be created due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const productAlreadyExists = await productRepository.findProductByName(createProductData.name);

    // Checking to see if a product with the provided name already exists
    if (productAlreadyExists) {
      return {
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'A product already exists with this name'
      };
    }

    const createdProduct = await productRepository.createProduct(createProductData);

    // Checking to see if the product was created
    if (createdProduct) {
      return {
        statusCode: 201,
        statusMessage: 'Created',
        message: 'The product has been created successfully',
        data: createdProduct
      };
    } else {
      throw new Error('The product was not created successfully');
    }
  } catch (error) {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The product could not be created due to an unexpected error'
    };
  }
}

export const productService = {
  getAllProducts,
  getAvailableProducts,
  getProductById,
  createProduct
};
