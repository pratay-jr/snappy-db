const User = require("../models/userModel");
// brcypt is used to encryption of password 
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    // LOGIN page  BACKEND code
    const { username, password } = req.body;
    // finding the user in db and storing in existinguser 
    const user = await User.findOne({ username });
    if (!user)
    return res.json({ msg: "Incorrect Username or Password", status: false });
    // we are comparing the password entered by user in login page and hashed password stored in db 
    // compare is bcrpycst inBuiltfunc  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // if not valid password 
    if (!isPasswordValid)
    return res.json({ msg: "Incorrect Username or Password", status: false });
  delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    // register page  BACKEND code
    const { username, email, password } = req.body;
    // IF USERNAME IS PRESENT IN DB THEN RETURNS TRUE ELSE RETURNS FALSE 
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    // Bcrypt uses the password and salt as inputs to a key expansion function (an algorithm called "Eksblowfish").
    // Hashing the password to increase privacy before storing in db ; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    // as we have hashed our password so we dont require our main password anymore  
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    // next is used to pass an error to the next error handling middleware
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    // user.find({_id:{$ne:req.params.id}:ythis will include all the id except the user id 
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
