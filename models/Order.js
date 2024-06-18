
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
// Define your schema fields here
});


// Middleware for create
OrderSchema.post("save", function (doc) {
orderObserver("create", doc);
});

// Pre middleware for update to get the document before it is updated
OrderSchema.pre("findOneAndUpdate", async function (next) {
this._updateDoc = await this.model.findOne(this.getQuery());
next();
});

// Post middleware for update
OrderSchema.post("findOneAndUpdate", function () {
orderObserver("update", this._updateDoc);
});

// Pre middleware for delete to get the document before it is deleted
OrderSchema.pre("findOneAndDelete", async function (next) {
this._deleteDoc = await this.model.findOne(this.getQuery());
next();
});

OrderSchema.pre("findByIdAndDelete", async function (next) {
this._deleteDoc = await this.model.findById(this.getQuery()._id);
next();
});

// Post middleware for delete
OrderSchema.post("findOneAndDelete", function () {
orderObserver("delete", this._deleteDoc);
});

OrderSchema.post("findByIdAndDelete", function () {
orderObserver("delete", this._deleteDoc);
});


const Order = mongoose.model('order', OrderSchema);

module.exports = Order;
