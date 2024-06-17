import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  console.log("Request Body:", req.body); // Check if req.body is correctly populated

  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    // Sample URLs (adjust as per your actual URL structure)
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password:hashedPassword, // Remember to hash this password
      gender,
      profilePic: gender === "MALE" ? boyProfilePic : girlProfilePic,
    });
if(newUser){
  generateTokenAndSetCookie(newUser._id,res);
  await newUser.save();

  return res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    username: newUser.username,
    gender: newUser.gender,
    profilePic: newUser.profilePic,
  });
}
else{
  return res.status(400).json({ error: "Internal Server Error" });
}

  } catch (error) {
    console.error("Error signing up:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    console.log("Found user:", user);
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id,res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,    
    });

  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
  // Implement login logic
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({ message: "Logged out successfully" });
    
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
  // Implement logout logic
};
