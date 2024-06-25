import express from 'express';
import { orderService } from '../services/order.service';
import { AuthenticatedUserRequest } from '../interfaces/request/authenticated-user-request';
import { CreateOrderDTO } from '../dto/order/create-order.dto';

/**
 * Function that extracts the necessary data from the request query to get all orders and send them on the response
 * @param req http request containing the necesary data to get all orders and the current authenticated user, contains the pagination parameters
 * @param res http response to be sent with the results of this function
 */
async function getAllOrders(req: AuthenticatedUserRequest, res: express.Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const responseContent = await orderService.getAllOrders(page, limit);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request query and body to get all the orders made by the current user and send them on the response
 * @param req http request containing the necesary data to get all the orders made by the current user and the current authenticated user, contains the pagination parameters
 * @param res http response to be sent with the results of this function
 */
async function getCurrentUserOrders(req: AuthenticatedUserRequest, res: express.Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const userId = req.authenticatedUser!.id;

  const responseContent = await orderService.getCurrentUserOrders(page, limit, userId);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request params and body to get an order by its id and send it on the response
 * @param req http request containing the necesary data to get an order by its id and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function getOrderById(req: AuthenticatedUserRequest, res: express.Response) {
  const orderId = Number(req.params.id);
  const authenticatedUser = req.authenticatedUser!;

  const responseContent = await orderService.getOrderById(orderId, authenticatedUser);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request query and params to get an order by its id and send it on the response
 * @param req http request containing the necesary data to get an order by its id and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function getOrdersByUserId(req: AuthenticatedUserRequest, res: express.Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const userId = Number(req.params.id);

  const responseContent = await orderService.getOrdersByUserId(page, limit, userId);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request body to create an order and send it on the response
 * @param req http request containing the necesary data to create an order and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function createOrder(req: AuthenticatedUserRequest, res: express.Response) {
  const createOrderData: CreateOrderDTO = {
    userId: req.authenticatedUser!.id,
    orderProducts: req.body.orderProducts
  };

  const responseContent = await orderService.createOrder(createOrderData);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request params and body to create an order and send it on the response
 * @param req http request containing the necesary data to create an order and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function cancelOrder(req: AuthenticatedUserRequest, res: express.Response) {
  const orderId = Number(req.params.id);
  const authenticatedUser = req.authenticatedUser!;

  const responseContent = await orderService.cancelOrder(orderId, authenticatedUser);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request params to advance the status of an order by its id and send it on the response
 * @param req http request containing the necesary data to advance the status of an order by its id and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function advanceOrderStatus(req: AuthenticatedUserRequest, res: express.Response) {
  const orderId = Number(req.params.id);

  const responseContent = await orderService.advanceOrderStatusById(orderId);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request params to delete an order by its id and send it on the response
 * @param req http request containing the necesary data to delete an order by its id and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function deleteOrderById(req: AuthenticatedUserRequest, res: express.Response) {
  const orderId = Number(req.params.id);

  const responseContent = await orderService.deleteOrderById(orderId);
  return res.status(responseContent.statusCode).send(responseContent);
}

export const orderController = {
  getAllOrders,
  getCurrentUserOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  cancelOrder,
  advanceOrderStatus,
  deleteOrderById
};
