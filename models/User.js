const mongoose = require("mongoose");
const userObserver = require("../observers/userObserver");
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
