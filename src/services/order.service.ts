import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
import { paginationUtil } from '../utils/pagination.util';
import { numericIdValidation } from '../input-validation/numeric-id.validation';
import { orderValidation } from '../input-validation/order.validation';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { CreateOrderDTO } from '../dto/order/create-order.dto';
import { ResponseContentDTO } from '../dto/response-content/response-content.dto';
import { AuthenticatedUser } from '../interfaces/authentication/authenticated-user';

/**
 * Function that validates the business logic to get all orders with result pagination and uses a repository to find them in the DB
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getAllOrders(page: number, limit: number): Promise<ResponseContentDTO<Order[]>> {
  try {
    const orderCount = await orderRepository.countOrders();
    const paginationParams = paginationUtil.validatePaginationParams(page, limit);
    // Calculates the pagination based on the validated parameters
    const orderPages = paginationUtil.calculatePages(
      orderCount,
      paginationParams.page,
      paginationParams.limit
    );
    const orders = await orderRepository.findPaginatedOrders(
      paginationParams.skip,
      paginationParams.limit
    );
    return {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'The orders have been found successfully',
      data: orders,
      paginationPages: orderPages
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The orders could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to get all orders made by the user that is currently logged in, with result pagination, and uses a repository to find them in the DB
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @param userId, the id of the user that is currently logged in, that has been validated by the authenticated user middleware
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getCurrentUserOrders(
  page: number,
  limit: number,
  userId: number
): Promise<ResponseContentDTO<Order[]>> {
  try {
    const orderCount = await orderRepository.countUserOrders(userId);
    const paginationParams = paginationUtil.validatePaginationParams(page, limit);
    // Calculates the pagination based on the validated parameters
    const orderPages = paginationUtil.calculatePages(
      orderCount,
      paginationParams.page,
      paginationParams.limit
    );
    const orders = await orderRepository.findPaginatedUserOrders(
      paginationParams.skip,
      paginationParams.limit,
      userId
    );
    return {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'Your orders have been found successfully',
      data: orders,
      paginationPages: orderPages
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The orders could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to get an order by it's id and uses a repository to find them in the DB
 * @param orderId, the id of the order to be found
 * @param authenticatedUser, the user that is making the request
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getOrderById(
  orderId: number,
  authenticatedUser: AuthenticatedUser
): Promise<ResponseContentDTO<Order | null>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(orderId);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'No order could be found due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const orderById = await orderRepository.findOrderById(orderId);

    if (!orderById) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'No order was found with the id provided'
      };
    }

    // If an order is found with the id provided, it only returns it if it was made by the current user or the current user is an admin
    if (authenticatedUser.id === orderById.userId || authenticatedUser.userRole === 'Admin') {
      return {
        statusCode: 200,
        statusMessage: 'OK',
        message: 'The order has been found successfully',
        data: orderById
      };
    } else {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'No order made by the user was found with the id provided'
      };
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The order could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to get all orders made by a user, with result pagination, and uses a repository to find them in the DB
 * @param page, the number of the page to be seen
 * @param limit, the number of items to be shown in a page
 * @param userId, the id of the user that made the orders to find
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function getOrdersByUserId(
  page: number,
  limit: number,
  userId: number
): Promise<ResponseContentDTO<Order[]>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(userId);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'No orders could be found due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }
    const orderCount = await orderRepository.countUserOrders(userId);
    const paginationParams = paginationUtil.validatePaginationParams(page, limit);
    // Calculates the pagination based on the validated parameters
    const orderPages = paginationUtil.calculatePages(
      orderCount,
      paginationParams.page,
      paginationParams.limit
    );
    const orders = await orderRepository.findPaginatedUserOrders(
      paginationParams.skip,
      paginationParams.limit,
      userId
    );
    return {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'The orders made by the user have been found successfully',
      data: orders,
      paginationPages: orderPages
    };
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The orders made by the user could not be found due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to create an order and uses a repository to create it in the DB
 * @param createOrderData, the data sent from the controller to create an order
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function createOrder(
  createOrderData: CreateOrderDTO
): Promise<ResponseContentDTO<Order | Product[]>> {
  try {
    // Only the order products are validated since the current user id es already validated by the authentication middleware
    const validationErrors = orderValidation.validateOrderProducts({
      orderProducts: createOrderData.orderProducts
    });

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'No order could be created due to the following validation errors: ' +
          [...new Set(validationErrors)].join(', ')
      };
    }

    // Sorting the order products by their ids in ascending order
    createOrderData.orderProducts.sort((a, b) => a.productId - b.productId);

    // Verifying that an order product is not included more than once in the same order
    const duplicateOrderProducts = createOrderData.orderProducts.filter((element, index) => {
      return element.productId == createOrderData.orderProducts[index - 1]?.productId;
    });

    // If an order product is included more than once in the same order we return a 400 error with the corresponding products ids
    if (duplicateOrderProducts.length > 0) {
      const duplicateOrderProductsIds = duplicateOrderProducts.map((element) => {
        return element.productId;
      });

      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'The product(s) with the following id(s) were included multiple times in the same order: ' +
          [...new Set(duplicateOrderProductsIds)].join(', ') +
          '. To purchase more than one of a product update the quantity'
      };
    }

    // Getting the id(s) of order products to verify that they exist in the DB
    const orderProductsIds = createOrderData.orderProducts.map((element) => {
      return element.productId;
    });

    // Finding the products to be ordered in the DB with the ids provided, the products are sorted by their ids in ascending order
    const productsToOrder = await productRepository.findManyProductsByIds(orderProductsIds);

    // If none of the ids provided corresponds to an actual product id a 404 error is sent
    if (productsToOrder.length === 0) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'No products were found with the id(s) provided'
      };
    }

    // Getting the id(s) of the products found in the DB
    const foundProductsIds = productsToOrder.map((element) => {
      return element.id;
    });

    // Getting the id(s) of order products that were not found in the DB
    const orderProductsNotFound = orderProductsIds.filter(
      (element) => !foundProductsIds.includes(element)
    );

    // If any order products were not found on the DB, a 404 error is sent with the corresponding id(s)
    if (orderProductsNotFound.length > 0) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message:
          'The product(s) with the following id(s) could not be found: ' +
          orderProductsNotFound.join(', ')
      };
    }

    // Since there are no duplicated values, both arrays are sorted by their ids in ascending order and all the ids provided corresponded to a product in the DB
    // Both arrays now have the same products in the same indexes and we can compare the provided quantity and the available stock
    const insufficientStockProducts = productsToOrder.filter((element, index) => {
      return element.availableStock < createOrderData.orderProducts[index].quantity;
    });

    // The response includes the products that did not have enough available stock so the user can adjust the quantity accordingly
    if (insufficientStockProducts.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'The following product(s) do not have enough available stock to fulfill the order:',
        data: insufficientStockProducts
      };
    }

    const updatedProducts: Product[] = [];

    // The Products to be ordered get their available stock updated, if any one update fails all updates made are reverted with a function
    try {
      for (let i = 0; i < createOrderData.orderProducts.length; i++) {
        const element = createOrderData.orderProducts[i];
        const updatedProduct = await productRepository.updateProductAvailableStockById(
          element.productId,
          productsToOrder[i].availableStock - element.quantity
        );
        updatedProducts.push(updatedProduct);
      }
    } catch {
      // Reverts the changes made to products available stock and generates the error message to be sent
      throw Error(
        await restoreProductsAvailableStock(
          updatedProducts,
          productsToOrder,
          'An error ocurred in the product available stock update'
        )
      );
    }

    let createdOrder: Order;

    try {
      createdOrder = await orderRepository.createOrder(
        { userId: createOrderData.userId, orderStatus: 'Pending', lastUpdateDate: new Date() },
        createOrderData.orderProducts
      );
      if (createdOrder) {
        return {
          statusCode: 201,
          statusMessage: 'Created',
          message: 'The order has been created successfully',
          data: createdOrder
        };
      } else {
        throw new Error('Something went wrong in the order creation');
      }
    } catch {
      // Reverts the changes made to products available stock and generates the error message to be sent
      throw Error(
        await restoreProductsAvailableStock(
          updatedProducts,
          productsToOrder,
          'The order could not be created successfully'
        )
      );
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The order could not be created due to an unexpected error'
    };
  }
}

/**
 * Function that validates the business logic to cancel an order by it's id and uses a repository to update them in the DB
 * @param orderId, the id of the order to be canceled
 * @param authenticatedUser, the user that is making the request
 * @returns responseContentDTO, the result from this function to be sent in the response
 */
async function cancelOrder(
  orderId: number,
  authenticatedUser: AuthenticatedUser
): Promise<ResponseContentDTO<Order | null>> {
  try {
    const validationErrors = numericIdValidation.validateNumericId(orderId);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message:
          'No order could be canceled due to the following validation errors: ' +
          validationErrors.join(', ')
      };
    }

    const orderToCancel = await orderRepository.findOrderById(orderId);

    if (!orderToCancel) {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'No order was found with the id provided'
      };
    }

    if (orderToCancel.orderStatus === 'Canceled') {
      return {
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'The order found with the id provided is already canceled'
      };
    }

    // If an order is found with the id provided, it only cancels it if it was made by the current user or the current user is an admin
    if (authenticatedUser.id === orderToCancel.userId || authenticatedUser.userRole === 'Admin') {
      if (orderToCancel.orderStatus !== 'Delivered' && orderToCancel.orderStatus !== 'Shipped') {
        const canceledOrder = await orderRepository.updateOrderStatus(orderId, 'Canceled');
        return {
          statusCode: 200,
          statusMessage: 'OK',
          message: 'The order has been canceled successfully',
          data: canceledOrder
        };
      } else {
        throw new Error('The order was not canceled successfully');
      }
    } else {
      return {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'No order made by the user was found with the id provided'
      };
    }
  } catch {
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'The order could not be canceled due to an unexpected error'
    };
  }
}

/**
 * Function to revert the updates made to products available stock in the order creation process, in case it fails
 * @param updatedProducts, an array containing the products that were updated before the error
 * @param productsToOrder, an array containing the original values of the products that were going to be ordered
 * @param errorMessageStart, the start of the error message that will say were the order creation process went wrong
 * @returns errorMessage, the error message to be included in the error thrown from where the function is called
 */
async function restoreProductsAvailableStock(
  updatedProducts: Product[],
  productsToOrder: Product[],
  errorMessageStart: string
): Promise<string> {
  const restoredProducts: Product[] = [];
  for (let i = 0; i < updatedProducts.length; i++) {
    const element = updatedProducts[i];
    const restoredProduct = await productRepository.updateProductAvailableStockById(
      element.id,
      // the original available stock for that product is set back in place
      productsToOrder[i].availableStock
    );
    restoredProducts.push(restoredProduct);
  }
  let restorationConfirmation: string = ', the product available stock restauration failed';
  if (restoredProducts.length == updatedProducts.length) {
    restorationConfirmation =
      ', the products available stock has been restored to its original value';
  }
  return errorMessageStart + restorationConfirmation;
}

export const orderService = {
  getAllOrders,
  getCurrentUserOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  cancelOrder
};
