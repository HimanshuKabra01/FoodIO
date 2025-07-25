import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body; 
  const user = await UserModel.findOne({ username }); 

  if (user) {
    return res.json({ message: "User already exists" }); 
  }

  const hashedPassword = await bcrypt.hash(password, 10); 

  const newUser = new UserModel({ username, email, password: hashedPassword }); 
  await newUser.save(); 

  res.json({ message: "User Registered Successfully!" }); 
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body; 
  const user = await UserModel.findOne({ username }); 
  if (!user) {
    return res.json({ message: "User doesn't exist" }); 
  }
  const isPasswordValid = await bcrypt.compare(password, user.password); 

  if (!isPasswordValid) {
    return res.json({ message: "Username or password is incorrect" }); 
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
  res.json({ token, userID: user._id }); 
});

export { router as useRouter };
