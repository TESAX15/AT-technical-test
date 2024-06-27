import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // User Seeding
  const blockedUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'blocked.user@gmail.com',
      passwordHash: '$2b$10$BWOCOCg.CCsdC.obMbnDdeySAoEpscNq11YN95ApqTvNHC/SKqW6O',
      isBlocked: true,
      userRole: 'NonAdmin'
    }
  });
  const adminUser = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: 'admin.user@gmail.com',
      passwordHash: '$2b$10$4j5NKkx0WWJOtqjE6zOGq.nhSfOWaeJydHkI7gWKCywWBkg/wcdGe',
      isBlocked: false,
      userRole: 'Admin'
    }
  });
  const userToUpdate = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      email: 'user.to.update@gmail.com',
      passwordHash: '$2b$10$BWWb6GPk5ikXcgU.C0Nl7eDsWUQSPI7ZhOEwmuGZfdw2Lt8aKnPEu',
      isBlocked: false,
      userRole: 'NonAdmin'
    }
  });
  const userToDelete = await prisma.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
      email: 'user.to.delete@gmail.com',
      passwordHash: '$2b$10$XFbUH4qHjBlnWN0LWHY7a.EMWQbz49Q3WzaZpbzK6lO3BrftBpInS',
      isBlocked: false,
      userRole: 'NonAdmin'
    }
  });
  const userWithOrders = await prisma.user.upsert({
    where: { id: 5 },
    update: {},
    create: {
      email: 'user.w.orders@gmail.com',
      passwordHash: '$2b$10$XFbUH4qHjBlnWN0LWHY7a.EMWQbz49Q3WzaZpbzK6lO3BrftBpInS',
      isBlocked: false,
      userRole: 'NonAdmin'
    }
  });
  console.log('Seeding Users');
  console.log({ blockedUser, adminUser, userToUpdate, userToDelete, userWithOrders });

  // Product Seeding
  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'product 1',
      description: 'description 1',
      price: 1,
      availableStock: 1
    }
  });
  const product2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'product 2',
      description: 'description 2',
      price: 2,
      availableStock: 0
    }
  });
  const product3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'product 3',
      description: 'description 3',
      price: 3,
      availableStock: 3
    }
  });
  const product4 = await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'product 4',
      description: 'description 4',
      price: 4,
      availableStock: 4
    }
  });
  console.log('Seeding Products');
  console.log({ product1, product2, product3, product4 });

  // Order Seeding
  const order1 = await prisma.order.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: 5,
      orderStatus: 'Pending',
      lastUpdateDate: new Date(),
      orderProducts: {
        createMany: {
          data: [
            {
              productId: 3,
              quantity: 1
            },
            {
              productId: 4,
              quantity: 1
            }
          ]
        }
      }
    }
  });
  const order2 = await prisma.order.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: 5,
      orderStatus: 'Pending',
      lastUpdateDate: new Date(),
      orderProducts: {
        createMany: {
          data: [
            {
              productId: 3,
              quantity: 1
            },
            {
              productId: 4,
              quantity: 1
            }
          ]
        }
      }
    }
  });
  const order3 = await prisma.order.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: 2,
      orderStatus: 'Shipped',
      lastUpdateDate: new Date(),
      orderProducts: {
        createMany: {
          data: [
            {
              productId: 3,
              quantity: 1
            },
            {
              productId: 4,
              quantity: 1
            }
          ]
        }
      }
    }
  });
  const order4 = await prisma.order.upsert({
    where: { id: 4 },
    update: {},
    create: {
      userId: 2,
      orderStatus: 'Delivered',
      lastUpdateDate: new Date(),
      orderProducts: {
        createMany: {
          data: [
            {
              productId: 3,
              quantity: 1
            },
            {
              productId: 4,
              quantity: 1
            }
          ]
        }
      }
    }
  });
  console.log('Seeding Orders');
  console.log({ order1, order2, order3, order4 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
