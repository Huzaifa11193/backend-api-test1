const mongoose = require('mongoose');
  const { Schema } = mongoose;
  
  const ProductSchema = new Schema({
  // Define your schema fields here
  });
  
  
// Middleware for create
ProductSchema.post("save", function (doc) {
productObserver("create", doc);
});

// Pre middleware for update to get the document before it is updated
ProductSchema.pre("findOneAndUpdate", async function (next) {
this._updateDoc = await this.model.findOne(this.getQuery());
next();
});

// Post middleware for update
ProductSchema.post("findOneAndUpdate", function () {
productObserver("update", this._updateDoc);
});

// Pre middleware for delete to get the document before it is deleted
ProductSchema.pre("findOneAndDelete", async function (next) {
this._deleteDoc = await this.model.findOne(this.getQuery());
next();
});

ProductSchema.pre("findByIdAndDelete", async function (next) {
this._deleteDoc = await this.model.findById(this.getQuery()._id);
next();
});

// Post middleware for delete
ProductSchema.post("findOneAndDelete", function () {
productObserver("delete", this._deleteDoc);
});

ProductSchema.post("findByIdAndDelete", function () {
productObserver("delete", this._deleteDoc);
});


const Product = mongoose.model('product', ProductSchema);
  
  module.exports = Product;
  