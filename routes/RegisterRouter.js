const express = require("express");
const router = express.Router();
const User = require('../db/userModel');

// URL: /api/register
router.post("/register", async(req, res) => {
  try {
    const {login_name, password, first_name, last_name, location, description, occupation} = req.body;

    
    if (!login_name || !password || !first_name || !last_name) {
      return res.status(400).json({ error: "Các trường login_name, password, first_name, và last_name là bắt buộc" });
    }

   
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
    }

    // Tạo người dùng mới
    const newUser = new User({
      login_name,
      password, 
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || ""
    });

    await newUser.save();
    
    
    const userResponse = {
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      location: newUser.location,
      description: newUser.description,
      occupation: newUser.occupation
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(400).json({ error: error.message || "Đăng ký thất bại" });
  }
});

module.exports = router;
