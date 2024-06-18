const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const dbconnect = require("../config/dbconnect");

dbconnect();

async function generateRandomUsers(numUsers) {
  try {
    const users = [];
    for (var i = 0; i < numUsers; i++) {
      const user = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      users.push(user);
    }

    await User.insertMany(users);
    console.log("User Seeder Run Successfully!");
  } catch (err) {
    console.log(err);
  }
}

generateRandomUsers(2);

// node seeders/userSeeder.js
