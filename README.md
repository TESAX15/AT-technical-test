Tomás Sánchez's Technical Test 
=========
This repository houses an Express API developed with Node.js written in Typescript, that uses a PostgreSQL database for persistance.
The API has user authentication, user mangement, product inventory management and order processing features.

Features
---------
User Authentication: User Sign Up, Login and Log Out
User Management(Admin Only): User List(All, By Id), Create, Update, Block, Unblock and Delete
Product Inventory Management(Authenticated Only): Product List(All, Available, By Id), Create, Update and Delete
Order Processing Features(Authenticated Only): Order List(All, Current User, By Id, By User Id), Create, Cancel, Advance Order Status and Delete

All these features will be detailed further in the API Documentation Section.

Prerequisites
---------
Install the latest LTS version of Node.js along with the npm package manager. Can be found at this [Link](https://nodejs.org/en)

Install the latest LTS version of PostgreSQL. Can be found at this [Link](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

Project Installation & Configuration
---------
1) Clone the github repository `git clone https://github.com/TESAX15/AT-technical-test.git`
2) Open the project directory `cd AT-technical-test`
3) Install the projects dependencies `npm install`
4) Create a copy of the example.env file and rename it to .env

Database Configuration
---------
1) Create a PostgreSQL Database `CREATE DATABASE test_database`
2) Replace the DATABASE_URL in the .env file to work with your newly created database `DATABASE_URL ="postgresql://user:password@localhost:5432/test_database"`
3) Run the Prisma Migrations to create database tables based on the schemas in the file prisma/schema.prisma `npx prisma migrate dev`
4) Run the Prisma db seed command to seed the database with initial data `npx prisma db seed` (The seeded records will be printed in the console when they are seeded)

Run the Project
---------
1) Run the build script `npm run build`
2) Run the start script `npm run start`
