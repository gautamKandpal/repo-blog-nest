import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({ message: "User created Successfully !" });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ message: err.message });
  }
};
