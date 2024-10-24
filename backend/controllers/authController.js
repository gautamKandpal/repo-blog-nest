import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      next(errorHandler(400, "All field are required"));
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
