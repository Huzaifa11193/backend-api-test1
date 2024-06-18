
 const { faker } = require("@faker-js/faker");
const Product = require("../models/Product");
const dbconnect = require("../config/dbconnect");

dbconnect();

async function generateRandomProducts(numUsers) {
  try {
    const Products = [];
    for (var i = 0; i < numUsers; i++) {
      const Product = {
       // Define your schema fields here
      };
      Products.push(Product);
    }

    await Product.insertMany(Products);
    console.log("Product Seeder Run Successfully!");
  } catch (err) {
    console.log(err);
  }
}

generateRandomProducts(2);

// node seeders/productSeeder.js

  