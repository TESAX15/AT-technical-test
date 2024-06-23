import express from 'express';
import { productService } from '../services/product.service';
import { CreateProductDTO } from '../dto/product/create-product.dto';
import { AuthenticatedUserRequest } from '../interfaces/request/authenticated-user-request';

/**
 * Function that extracts the necessary data from the request query to get all products and send them on the response
 * @param req http request containing the necesary data to get all products and the current authenticated user, contains the pagination parameters
 * @param res http response to be sent with the results of this function
 */
async function getAllProducts(req: AuthenticatedUserRequest, res: express.Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const responseContent = await productService.getAllProducts(page, limit);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request query to get all available products and send them on the response
 * @param req http request containing the necesary data to get all available products and the current authenticated user, contains the pagination parameters
 * @param res http response to be sent with the results of this function
 */
async function getAvailableProducts(req: AuthenticatedUserRequest, res: express.Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const responseContent = await productService.getAvailableProducts(page, limit);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request parameters to get a product by it's id and send it on the response
 * @param req http request containing the necesary parameters to get a product by it's id and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function getProductById(req: AuthenticatedUserRequest, res: express.Response) {
  const id = Number(req.params.id);
  const responseContent = await productService.getProductById(id);
  return res.status(responseContent.statusCode).send(responseContent);
}

/**
 * Function that extracts the necessary data from the request body to create a product and send it on the response
 * @param req http request containing the necesary data to create a product and the current authenticated user
 * @param res http response to be sent with the results of this function
 */
async function createProduct(req: AuthenticatedUserRequest, res: express.Response) {
  const createProductInfo: CreateProductDTO = req.body;

  const responseContent = await productService.createProduct(createProductInfo);
  res.status(responseContent.statusCode).send(responseContent);
}

export const productController = {
  getAllProducts,
  getAvailableProducts,
  getProductById,
  createProduct
};
