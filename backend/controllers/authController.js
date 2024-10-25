import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "All field are required"));
    }

    const hashPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({ message: "User created Successfully !" });
  } catch (err) {
    // console.log(err);
    next(err);
    // res.status(400).json({ message: err.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === " " || password === " ") {
    return next(errorHandler(400, "All fields are required!"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(400, "Invalid username or password"));
    }

    //compare password with the actual password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid username or password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    const { password: userPassword, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("acces_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (err) {
    next(err);
  }
};
