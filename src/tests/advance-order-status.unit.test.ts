import { orderService } from '../services/order.service';
import { orderRepository } from '../repositories/order.repository';
import { getMockedOrderWithStatus } from './mock-values';

jest.mock('../repositories/order.repository');

describe('Order Service: Advance Order Status Tests', () => {
  const findOrderByIdMock = orderRepository.findOrderById as jest.Mock;
  const updateOrderStatusMock = orderRepository.updateOrderStatus as jest.Mock;

  it('Should return order status advanced successfully response', async () => {
    // Mocking the return of an order with a 'Pending' Status
    findOrderByIdMock.mockReturnValueOnce(getMockedOrderWithStatus('Pending'));

    updateOrderStatusMock.mockReturnValueOnce(getMockedOrderWithStatus('Processing'));

    const responseContent = await orderService.advanceOrderStatusById(1);

    expect(responseContent.isErrorMessage).toBe(false);
    expect(responseContent.statusCode).toBe(200);
    expect(responseContent.message).toBe('The order status has been advanced successfully');
  });

  it('Should return order is already completed response', async () => {
    // Mocking the return of an order that is already completed
    findOrderByIdMock.mockReturnValueOnce(getMockedOrderWithStatus('Canceled'));

    const responseContent = await orderService.advanceOrderStatusById(1);

    expect(responseContent.isErrorMessage).toBe(true);
    expect(responseContent.statusCode).toBe(400);
    expect(responseContent.message).toBe(
      'The order status cannot be advanced because the order is completed, only orders with the pending, processing or shipped status can be advanced'
    );
  });
});
