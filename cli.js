// node cli.js create <name> [-m, --model] [-c, --controller] [-r, --route] [-s, --seeder] [-a, --all]

// node cli.js create:observer order  -m Order
// node cli.js create:observer order


const { Command } = require("commander");
const fs = require("fs-extra");
const path = require("path");

const program = new Command();

program
  .name("backend-api-test1")
  .description("CLI for backend-api-test1")
  .version("1.0.0");

try {
  program
    .command("create <name>")
    .description("Create a new model, controller , seeder, and route")
    .option("-m, --model", "Generate only the model")
    .option("-c, --controller", "Generate only the controller")
    .option("-r, --route", "Generate only the route")
    .option("-s, --seeder", "Generate only the seeder")
    .option(
      "-a, --all",
      "Generate all parts: model, controller , seeder, and route"
    )
    .action((name, options) => {
      const modelName = name.charAt(0).toUpperCase() + name.slice(1);
      const controllerName = `${modelName}Controller`;
      const routeName = `${name}Router`;

      // Paths
      const modelPath = path.join(__dirname, "models", `${modelName}.js`);
      const controllerPath = path.join(
        __dirname,
        "controllers",
        `${controllerName}.js`
      );
      const routePath = path.join(__dirname, "routes", `${name}Route.js`);

      const seederPath = path.join(__dirname, "seeders", `${name}Seeder.js`);

      // Templates
      const modelTemplate = `const mongoose = require('mongoose');
  const { Schema } = mongoose;
  
  const ${modelName}Schema = new Schema({
  // Define your schema fields here
  });
  
  const ${modelName} = mongoose.model('${name}', ${modelName}Schema);
  
  module.exports = ${modelName};
  `;

      const controllerTemplate = `const ${modelName} = require("../models/${modelName}");
  
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
  `;

      const routeTemplate = `
  const express = require('express');
  const { list, create, update, delete_, detail } = require('../controllers/${controllerName}');
  
  const ${routeName} = express.Router();
  
  ${routeName}.get('', list);
  ${routeName}.post('/create', create);
  ${routeName}.put('/edit/:id', update);
  ${routeName}.delete('/delete/:id', delete_);
  ${routeName}.get('/:id', detail);
  
  module.exports = ${routeName};
  `;

      const seederTemplate = `
 const { faker } = require("@faker-js/faker");
const ${modelName} = require("../models/${modelName}");
const dbconnect = require("../config/dbconnect");

dbconnect();

async function generateRandom${modelName}s(numUsers) {
  try {
    const ${modelName}s = [];
    for (var i = 0; i < numUsers; i++) {
      const ${modelName} = {
       // Define your schema fields here
      };
      ${modelName}s.push(${modelName});
    }

    await ${modelName}.insertMany(${modelName}s);
    console.log("${modelName} Seeder Run Successfully!");
  } catch (err) {
    console.log(err);
  }
}

generateRandom${modelName}s(2);

// node seeders/${name}Seeder.js

  `;

      // Create files based on options
      if (options.all || options.model) {
        fs.outputFileSync(modelPath, modelTemplate);
        console.log(`Created ${modelName} model`);
      }

      if (options.all || options.controller) {
        fs.outputFileSync(controllerPath, controllerTemplate);
        console.log(`Created ${controllerName}`);
      }

      if (options.all || options.route) {
        fs.outputFileSync(routePath, routeTemplate);
        console.log(`Created ${routeName} route`);
      }

      if (options.all || options.seeder) {
        fs.outputFileSync(seederPath, seederTemplate);
        console.log(`Created ${name} seeder`);
      }

      // Update kernel.js to import the new route dynamically
      const kernelPath = path.join(__dirname, "kernel.js");
      let kernelContent = fs.readFileSync(kernelPath, "utf8");

      if (options.all || options.route) {
        // Import the new route at the top of kernel.js
        kernelContent = `
    const ${routeName} = require('./routes/${name}Route');
    ${kernelContent}
    app.use('/api/${name.toLowerCase()}', ${routeName});
    `;
        fs.writeFileSync(kernelPath, kernelContent);
        console.log(`Updated kernel.js to include /api/${name.toLowerCase()}`);
      }

      if (
        !options.all &&
        !options.model &&
        !options.controller &&
        !options.route &&
        !options.seeder
      ) {
        console.log(
          "No action taken. Use -m, -c, -r , -s, or -a option to generate the required parts."
        );
      }
    });
} catch (err) {
  console.log(err);
}

try {
  program
    .command("create:observer <name>")
    .description("Create an observer")
    .option("-m, --model <model>", "Specify the model")
    .action((name, options) => {
      console.log(options);

      const observerPath = path.join(__dirname, `observers/${name}Observer.js`);
      const observerTemplate = `
const ${name}Observer = (event, doc) => {
switch (event) {
  case "create":
    console.log("${name} Created Observer", doc);
    break;
  case "update":
    console.log("${name} Updated Observer", doc);
    break;
  case "delete":
    console.log("${name} Deleted Observer", doc);
    break;
  default:
    console.log("Unknown event");
}
};

module.exports = ${name}Observer;
`;

      fs.outputFileSync(observerPath, observerTemplate);
      console.log(`Created ${name} Observer`);

      if (options.model) {
        const modelPath = path.join(__dirname, `models/${options.model}.js`);
        let modelContent = "";

        if (fs.existsSync(modelPath)) {
          modelContent = fs.readFileSync(modelPath, "utf8");
        } else {
          modelContent = `
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ${options.model}Schema = new Schema({
// Define your schema fields here
});

const ${options.model} = mongoose.model('${options.model.toLowerCase()}', ${
            options.model
          }Schema);

module.exports = ${options.model};
`;
        }

        const middlewareTemplate = `
// Middleware for create
${options.model}Schema.post("save", function (doc) {
${name}Observer("create", doc);
});

// Pre middleware for update to get the document before it is updated
${options.model}Schema.pre("findOneAndUpdate", async function (next) {
this._updateDoc = await this.model.findOne(this.getQuery());
next();
});

// Post middleware for update
${options.model}Schema.post("findOneAndUpdate", function () {
${name}Observer("update", this._updateDoc);
});

// Pre middleware for delete to get the document before it is deleted
${options.model}Schema.pre("findOneAndDelete", async function (next) {
this._deleteDoc = await this.model.findOne(this.getQuery());
next();
});

${options.model}Schema.pre("findByIdAndDelete", async function (next) {
this._deleteDoc = await this.model.findById(this.getQuery()._id);
next();
});

// Post middleware for delete
${options.model}Schema.post("findOneAndDelete", function () {
${name}Observer("delete", this._deleteDoc);
});

${options.model}Schema.post("findByIdAndDelete", function () {
${name}Observer("delete", this._deleteDoc);
});
`;

        // Insert middleware before the model and export lines if they exist
        if (modelContent.includes(`const ${options.model} = mongoose.model`)) {
          modelContent = modelContent.replace(
            `const ${options.model} = mongoose.model`,
            `${middlewareTemplate}\n\nconst ${options.model} = mongoose.model`
          );
        } else {
          modelContent += middlewareTemplate;
        }

        fs.outputFileSync(modelPath, modelContent);
        console.log(
          `Updated or created ${options.model} model with observer middleware.`
        );
      }
    });
} catch (err) {
  console.log(err);
}

program.parse(process.argv);
