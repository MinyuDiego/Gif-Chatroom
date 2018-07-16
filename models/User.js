/* const mongoose = require("mongoose");
const Schema   = mongoose.Schema; */

'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

mongoose.models = {};
mongoose.modelSchemas = {};

const userSchema = new Schema({
    username: String,
    password: String,
    profileGif: String
  }, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  });
  
  const User = mongoose.model("User", userSchema);
  module.exports = User;