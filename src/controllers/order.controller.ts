import express from 'express';
import { orderService } from '../services/order.service';
import { AuthenticatedUserRequest } from '../interfaces/request/authenticated-user-request';
import { CreateOrderDTO } from '../dto/order/create-order.dto';

/**
 * Function that extracts the necessary data from the request body to create an order and send it on the response
 * @param req http request containing the necesary data to create an order and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function createOrder(req: AuthenticatedUserRequest, res: express.Response) {
  const createOrderData: CreateOrderDTO = {
    userId: req.authenticatedUser!.id,
    orderProducts: req.body
  };

  const responseContent = await orderService.createOrder(createOrderData);
  return res.status(responseContent.statusCode).send(responseContent);
}

export const orderController = {
  createOrder
};
