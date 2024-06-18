const Product = require("../models/Product");
const { checkPermission } = require("../middleware/permission");
const list = async (req, res) => {
  
  checkPermission(true)(req, res, () => {});
  
  // Implement the list functionality
  res.status(200).json({ message: "Listed Succussfully" });
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
  list,
  create,
  update,
  delete_,
  detail,
};
