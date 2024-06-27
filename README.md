Tomás Sánchez's Technical Test 
=========
This repository houses an Express API developed with Node.js written in Typescript, that uses a PostgreSQL database for persistence.
The API has user authentication, user management, product inventory management and order processing features.

Features
---------
The API has four main feature groups:

- User Authentication: User Sign Up, Login and Log Out
- User Management: User List(All, By Id), Create, Update, Block, Unblock and Delete
- Product Inventory Management: Product List(All, Available, By Id), Create, Update and Delete
- Order Processing Features: Order List(All, Current User, By Id, By User Id), Create, Cancel, Advance Order Status and Delete

All these features will be detailed further in the API Documentation Section.
Some business rules that were implemented in the 

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

API Documentation
---------
The documentation of this API was done with Postman Collections, which are included as 4 JSON files in the 'postman-collections' folder (One for each of the main feature groups: Authentication, User, Product and Order)
However, it is recommended to read the online documentation of these collections, found in the following links:

- [Authentication](https://documenter.getpostman.com/view/21428321/2sA3dsnE4C)
- [User](https://documenter.getpostman.com/view/21428321/2sA3dsnE8X)
- [Product](https://documenter.getpostman.com/view/21428321/2sA3dsnE4G)
- [Order](https://documenter.getpostman.com/view/21428321/2sA3dsnE4F)

This documentation also has the option to "Run in Postman" which will download the collection directly to either the Postman app or open it in the Postman web page.

The example bodies in each collection have data corresponding to the seeding of the database made with Prisma. Also of note is that the password for each user is "contra123." as shown in the Login feature body.

Each Collection contains an overview of the features included, also they have a variable configured in the 'variables' tab of the collection to indicate the host that it's being run on, by default 'http://localhost:3000' but can be changed to be whatever host the user wants.

For each feature detailed in a collection there is a brief description of what the feature does, what it receives to perform the requests and the checks it does to determine the request response, all possible responses can be seen in the different examples for each feature.
