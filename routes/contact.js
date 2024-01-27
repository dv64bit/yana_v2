const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = Schema({
  name: String,
  email: String,
  contact: Number,
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
