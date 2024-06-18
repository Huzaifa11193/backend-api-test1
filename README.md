# Backend API Test Framework

This project provides a framework for quickly generating backend APIs with models, controllers, routes, and seeders. It also includes functionality to create observers for models, middleware for authentication, and email configuration.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Commands](#commands)
- [Configuration](#configuration)
- [Features](#features)
  - [Model](#model)
  - [Controller](#controller)
  - [Route](#route)
  - [Seeder](#seeder)
  - [Observer](#observer)
  - [Authentication Middleware](#authentication-middleware)
  - [Permissions Middleware](#permissions-middleware)
  - [Database Connection](#database-connection)
  - [Email Configuration](#email-configuration)
- [Examples](#examples)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Huzaifa11193/backend-api-test1.git
   cd backend-api-test1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

## Usage

### Commands

The CLI tool allows you to generate models, controllers, routes, seeders, and observers.

#### Create a new resource (model, controller, route, seeder)
```bash
node cli.js create <name> [-m, --model] [-c, --controller] [-r, --route] [-s, --seeder] [-a, --all]
```

- `name`: The name of the resource (e.g., `user`, `product`).
- Options:
  - `-m, --model`: Generate only the model.
  - `-c, --controller`: Generate only the controller.
  - `-r, --route`: Generate only the route.
  - `-s, --seeder`: Generate only the seeder.
  - `-a, --all`: Generate all parts (model, controller, route, seeder).

#### Create an observer
```bash
node cli.js create:observer <name> [-m, --model <model>]
```

- `name`: The name of the observer (e.g., `order`, `user`).
- Options:
  - `-m, --model <model>`: Specify the model to attach the observer.

## Configuration

### Environment Variables

Configure the following environment variables in your `.env` file:

```env
DB_CONNECTION_URL=mongodb://localhost:27017/yourdbname
PORT=9000
KEY=YourSecretKey
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_SECURE=true
MAIL_USER=yourmailuser
MAIL_PASS=yourmailpass
MAIL_EMAIL=youremail@example.com
```

### Database Connection

The database connection is handled in `config/dbconnect.js`:

```javascript
const mongoose = require('mongoose');
require("dotenv").config();

const dbconnect = () => {
    mongoose.connect(process.env.DB_CONNECTION_URL)
    .then(() => {
        console.log("MongoDB Connection Established Successfully");
    })
    .catch((error) => {
        console.log(error);
    });
};

module.exports = dbconnect;
```

### Mail Configuration

The email configuration is managed in `config/mail.js`:

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
});

const mail = async ({subject, text, html, to}) => {
    const info = await transporter.sendMail({
        from: `"Nodemailer" <${process.env.MAIL_EMAIL}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
    });

    console.log("Message sent: %s", info.messageId);
};

module.exports = mail;
```

## Features

### Model

Generates a Mongoose model. Example:
```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
```

### Controller

Generates a controller with CRUD operations. Example:
```javascript
const User = require("../models/User");

const list = async (req, res) => {
    // Implement the list functionality
};

const create = async (req, res) => {
    // Implement the create functionality
};

const update = async (req, res) => {
    // Implement the update functionality
};

const delete_ = async (req, res) => {
    // Implement the delete functionality
};

const detail = async (req, res) => {
    // Implement the detail functionality
};

module.exports = {
    list, create, update, delete_, detail
};
```

### Route

Generates an Express route. Example:
```javascript
const express = require('express');
const { list, create, update, delete_, detail } = require('../controllers/UserController');

const userRouter = express.Router();

userRouter.get('', list);
userRouter.post('/create', create);
userRouter.put('/edit/:id', update);
userRouter.delete('/delete/:id', delete_);
userRouter.get('/:id', detail);

module.exports = userRouter;
```

### Seeder

Generates a seeder for populating the database. Example:
```javascript
const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const dbconnect = require("../config/dbconnect");

dbconnect();

async function generateRandomUsers(numUsers) {
    try {
        const users = [];
        for (let i = 0; i < numUsers; i++) {
            const user = {
                // Define your schema fields here
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

// Run with: node seeders/userSeeder.js
```

### Observer

Generates an observer for model events. Example:
```javascript
const userObserver = (event, doc) => {
    switch (event) {
        case "create":
            console.log("User Created Observer", doc);
            break;
        case "update":
            console.log("User Updated Observer", doc);
            break;
        case "delete":
            console.log("User Deleted Observer", doc);
            break;
        default:
            console.log("Unknown event");
    }
};

module.exports = userObserver;
```

### Authentication Middleware

Middleware to verify JWT tokens. Example:
```javascript
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const secretKey = process.env.KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided.' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded;
        next();
    });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).json({ message: 'Email & password not found' });

        const token = jwt.sign({ email: user.email, name: user.name, id: user.id }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    login, verifyToken
};
```

### Permissions Middleware

Middleware to check permissions. Example:
```javascript
const checkPermission = (status) => (req, res, next) => {
    if (status) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden" });
    }
};

module.exports = { checkPermission };

// Usage: checkPermission(true)(req, res, () => {});
```

## Examples

### Creating a New Resource
```bash
# Create all parts (model, controller, route, seeder)
node cli.js create user -a

# Create only the model
node cli.js create user -m

# Create only the controller
node cli.js create user -c

# Create only the route
node cli.js create user -r

# Create only the seeder
node cli.js create user -s
```

### Creating an Observer
```bash
# Create an observer for a model
node cli.js create:observer order -m Order

# Create an observer without attaching to a model
node cli.js create:observer order
```

### Starting the Server
```bash
node kernel.js
```

### Running a Seeder
```bash
node seeders/userSeeder.js
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
