import { orderService } from '../services/order.service';
import { orderRepository } from '../repositories/order.repository';
import { getMockedOrderWithStatus } from './mock-values';

jest.mock('../repositories/order.repository');

describe('Order Service: Delete Order Tests', () => {
  const findOrderByIdMock = orderRepository.findOrderById as jest.Mock;
  const deleteOrderByIdMock = orderRepository.deleteOrderById as jest.Mock;

  it('Should return order delete successfully response', async () => {
    // Mocking the return of an order with a 'Completed' Status
    findOrderByIdMock.mockReturnValueOnce(getMockedOrderWithStatus('Completed'));

    deleteOrderByIdMock.mockReturnValueOnce(true);

    const responseContent = await orderService.deleteOrderById(1);

    expect(responseContent.isErrorMessage).toBe(false);
    expect(responseContent.statusCode).toBe(200);
    expect(responseContent.message).toBe('The order has been deleted successfully');
  });

  it('Should return order is still ongoing response', async () => {
    // Mocking the return of an order that has a 'Pending' status
    findOrderByIdMock.mockReturnValueOnce(getMockedOrderWithStatus('Pending'));

    const responseContent = await orderService.deleteOrderById(1);

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toBe(
      'The order cannot be deleted because it is still ongoing, only delivered or canceled orders can be deleted'
    );
  });
});
