const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subSchema = Schema({
  email: String,
});

const Subscribers = mongoose.model("Subscribers", subSchema);
module.exports = Subscribers;
