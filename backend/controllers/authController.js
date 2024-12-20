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

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );

    const { password: userPassword, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        // httpOnly: true,
        httpOnly: false,
      })
      .json(rest);
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          // httpOnly: true,
          httpOnly: false,
        })
        .json(rest);
      console.log("googleExistingSignin", rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: name.toLowerCase().split(" ").join(""),
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          // httpOnly: true,
          httpOnly: false,
        })
        .json(rest);
      console.log("googleNewSignin", rest);
    }
  } catch (error) {
    next(error);
  }
};
