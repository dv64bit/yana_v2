const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/YanaProject");

const userSchema = Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  joinedDate: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
  },
  location: String,
  language: String,
  description: String,
  about: String,
});

userSchema.plugin(plm);

const User = mongoose.model("User", userSchema);
module.exports = User;
