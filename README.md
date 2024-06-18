Sure, here's the README formatted according to GitHub's markdown syntax:

---

# My Custom Node.js Framework

## Overview

Welcome to My Custom Node.js Framework! This framework is designed to simplify the development of Node.js applications by providing a structured approach to creating observers and integrating them with your models.

## Features

- **Observer Creation:** Automatically generate observers for your models.
- **Middleware Integration:** Integrate observers seamlessly with Mongoose models.
- **CLI Commands:** Easy-to-use CLI commands to manage your project.

## Installation

To get started, clone the repository and install the dependencies:

```sh
git clone https://github.com/yourusername/my-custom-framework.git
cd my-custom-framework
npm install
```

## Usage

### CLI Commands

This framework includes a CLI tool to help you generate observers and integrate them with your models. Below are the available commands:

#### Create Observer

Create an observer for a specified model:

```sh
node cli.js create:observer <observer-name> -m <model-name>
```

- `<observer-name>`: The name of the observer you want to create.
- `<model-name>`: The name of the model to integrate with the observer.

Example:

```sh
node cli.js create:observer user -m User
```

### Project Structure

Here's an overview of the project structure:

```
my-custom-framework/
├── observers/
│   └── userObserver.js  # Generated observer
├── models/
│   └── User.js          # Mongoose model with integrated observer middleware
├── cli.js               # CLI tool for generating observers
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

### Example Model with Middleware

When you generate an observer for a model, the framework automatically adds middleware to handle create, update, and delete events. Here’s an example of what a model file might look like after generating an observer:

```js
const mongoose = require('mongoose');
const userObserver = require('../observers/userObserver');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  createdat: { type: Date, default: Date.now },
});

// Middleware for create
UserSchema.post("save", function (doc) {
  userObserver("create", doc);
});

// Pre middleware for update to get the document before it is updated
UserSchema.pre("findOneAndUpdate", async function (next) {
  this._updateDoc = await this.model.findOne(this.getQuery());
  next();
});

// Post middleware for update
UserSchema.post("findOneAndUpdate", function () {
  userObserver("update", this._updateDoc);
});

// Pre middleware for delete to get the document before it is deleted
UserSchema.pre("findOneAndDelete", async function (next) {
  this._deleteDoc = await this.model.findOne(this.getQuery());
  next();
});

UserSchema.pre("findByIdAndDelete", async function (next) {
  this._deleteDoc = await this.model.findById(this.getQuery()._id);
  next();
});

// Post middleware for delete
UserSchema.post("findOneAndDelete", function () {
  userObserver("delete", this._deleteDoc);
});

UserSchema.post("findByIdAndDelete", function () {
  userObserver("delete", this._deleteDoc);
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
```

### Observer Example

Here is an example of a generated observer:

```js
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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## License

This project is licensed under the MIT License.

## Contact

For any questions or inquiries, please contact [your-email@example.com](mailto:your-email@example.com).

---

Feel free to copy and paste this into your GitHub repository's README.md file. Adjust the repository URL, contact email, and any other specific details to fit your project.
