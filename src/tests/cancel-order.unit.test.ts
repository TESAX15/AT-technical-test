import { orderService } from '../services/order.service';
import { orderRepository } from '../repositories/order.repository';
import { userRole } from '../models/user.model';
import { getMockedOrderWithStatus } from './mock-values';

jest.mock('../repositories/order.repository');

const authenticatedUser = {
  id: 1,
  email: 'test.user@gmail.com',
  userRole: 'NonAdmin' as userRole
};

describe('Order Service: Cancel Order Tests', () => {
  const findOrderByIdMock = orderRepository.findOrderById as jest.Mock;

  it('Should return invalid order id response', async () => {
    // Canceling an order with an invalid id
    const responseContent = await orderService.cancelOrder(0, authenticatedUser);

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toContain(
      'No order could be canceled due to the following validation errors:'
    );
  });

  it('Should return no order could be found response', async () => {
    // Mocking the return as if no order was found with the id provided
    findOrderByIdMock.mockReturnValueOnce(null);

    const responseContent = await orderService.cancelOrder(1, authenticatedUser);

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(404);
    expect(responseContent.message).toBe('No order was found with the id provided');
  });

  it('Should return order is already canceled response', async () => {
    // Mocking the return of an order that is already canceled
    findOrderByIdMock.mockReturnValueOnce(getMockedOrderWithStatus('Canceled'));

    const responseContent = await orderService.cancelOrder(1, authenticatedUser);

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toBe(
      'The order found with the id provided is already canceled'
    );
  });

  it('Should return no order made by the user was found response', async () => {
    // Mocking the return of an order that belongs to the user with id 1
    findOrderByIdMock.mockReturnValueOnce(getMockedOrderWithStatus('Pending'));

    // Calling the cancelOrder function with a user that is not an admin or the owner of the order
    const responseContent = await orderService.cancelOrder(1, {
      id: 2,
      email: 'test.user2@gmail.com',
      userRole: 'NonAdmin'
    });

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(404);
    expect(responseContent.message).toBe(
      'No order made by the user was found with the id provided'
    );
  });
});
