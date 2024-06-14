import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Username or Password" });
    }
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(501).json({ error: "Internet Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{
        maxAge:0
    });
    res.status(200).json({message:"Logout Successfully"});
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(501).json({ error: "Internet Server Error" });
  }
  res.send("Logout Successful");
};
export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    if (password != confirmPassword) {
      return res.status(400).json({ error: "Password don't match" });
    }
    const user = await User.findOne({ userName: userName });

    if (user) {
      return res.status(400).json({ error: "User Already Exist" });
    }
    //Password
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    //https://avatar.iran.liara.run/public/boy?username=mayank
    const boypic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlpic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName: fullName,
      userName: userName,
      password: hashedpassword,
      gender: gender,
      profilePic: gender === "male" ? boypic : girlpic,
    });
    // console.log(newUser);
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in sign-up ");
    res.status(500).json({ error: "Internet Server Error" });
  }
};
