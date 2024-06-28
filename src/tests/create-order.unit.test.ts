import { orderService } from '../services/order.service';
import { productRepository } from '../repositories/product.repository';
import { orderRepository } from '../repositories/order.repository';
import { getMockedOrderWithStatus } from './mock-values';
import { getMockedProduct } from './mock-values';

jest.mock('../repositories/product.repository');
jest.mock('../repositories/order.repository');

describe('Order Service: Create Order Tests', () => {
  const findManyProductsByIdsMock = productRepository.findManyProductsByIds as jest.Mock;
  const updateProductAvailableStockByIdMock =
    productRepository.updateProductAvailableStockById as jest.Mock;
  const createOrderMock = orderRepository.createOrder as jest.Mock;

  it('Should return an order created response', async () => {
    // Mocking the product repository to return the order product
    findManyProductsByIdsMock.mockResolvedValue([getMockedProduct(2)]);

    // Mocking the product repository to return the product after updating its available stock
    updateProductAvailableStockByIdMock.mockResolvedValue([getMockedProduct(1)]);

    // Mocking the product repository to return the product after updating its available stock
    createOrderMock.mockResolvedValue(getMockedOrderWithStatus('Pending'));

    const responseContent = await orderService.createOrder({
      userId: 1,
      orderProducts: [{ productId: 1, quantity: 1 }]
    });

    expect(responseContent.isErrorMessage).toBe(false);
    expect(responseContent.statusCode).toBe(201);
    expect(responseContent.message).toBe('The order has been created successfully');
  });

  it('Should return validation error response', async () => {
    // Calling the createOrder function to create an order product with invalid product id and quantity
    const responseContent = await orderService.createOrder({
      userId: 1,
      orderProducts: [{ productId: 0, quantity: 0 }]
    });

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toContain(
      'No order could be created due to the following validation errors:'
    );
  });

  it('Should return product repeated response', async () => {
    // Calling the createOrder function to create an order product
    const responseContent = await orderService.createOrder({
      userId: 1,
      orderProducts: [
        { productId: 1, quantity: 1 },
        { productId: 1, quantity: 1 }
      ]
    });

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toContain(
      'The product(s) with the following id(s) were included multiple times in the same order:'
    );
  });

  it('Should return some products could not be found response', async () => {
    // Mocking the product repository to return only one of the products
    findManyProductsByIdsMock.mockResolvedValue([getMockedProduct(1)]);

    const responseContent = await orderService.createOrder({
      userId: 1,
      orderProducts: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 1 }
      ]
    });

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(404);
    expect(responseContent.message).toContain(
      'The product(s) with the following id(s) could not be found:'
    );
  });

  it('Should return not enough available stock response', async () => {
    // Mocking the product repository to return a product without enough stock
    findManyProductsByIdsMock.mockResolvedValue([getMockedProduct(0)]);

    const responseContent = await orderService.createOrder({
      userId: 1,
      orderProducts: [{ productId: 1, quantity: 1 }]
    });

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toContain(
      'The following product(s) do not have enough available stock to fulfill the order:'
    );
    expect(responseContent.data).toStrictEqual([getMockedProduct(0)]);
  });
});
