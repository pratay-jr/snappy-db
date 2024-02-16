const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // username is a required field
    required: true,
    // minimum length of the username is set to 3 characters
    min: 3,
    // maximum length of the username is set to 20 
    max: 20,
    // ensure each username is uniquee
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
    // this is for the dp that will be used after login
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  // url of users'avatr image
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);
