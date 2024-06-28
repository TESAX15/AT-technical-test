// Function to facilitate the setup of orders with different status for the test cases
export function getMockedOrderWithStatus(status: string) {
  return {
    id: 1,
    userId: 1,
    orderStatus: status,
    creationDate: new Date(),
    lastUpdateDate: new Date(),
    orderProducts: [
      {
        orderId: 1,
        productId: 1,
        quantity: 1,
        product: {
          id: 1,
          name: 'product 1',
          description: 'description 1',
          price: 1,
          availableStock: 1
        }
      }
    ]
  };
}

// Function to facilitate the setup of products with different test cases
export function getMockedProduct(availableStock: number) {
  return {
    id: 1,
    name: 'product 1',
    description: 'description 1',
    price: 1,
    availableStock: availableStock
  };
}
