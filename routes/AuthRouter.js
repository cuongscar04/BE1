const express = require("express");
const router = express.Router();
const User = require('../db/userModel')

//Login (api/admin/login)

router.post("/login", async(req, res) => {
  const {login_name, password} = req.body;

  if (!login_name || !password) {
    return res.status(400).json({message: "Yeu cau nhap ten dang nhap hoac mat khau"});
  }

  try {
    const user = await User.findOne({login_name}).lean();
    if (!user) {
      return res.status(404).json({error : "Sai ten dang nhap hoac mat khau"})  
    }

    if (user.password !== password) {
      return res.status(404).json({error : "Sai ten dang nhap hoac mat khau"});
    }

    req.session.user = {
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name
    };

    // Lưu session và gửi response bên trong callback
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({error: "Session save failed"});
      }
      
      // Chỉ gửi response sau khi session đã được lưu
      return res.status(200).json({
        message: "Đăng nhập thành công",
        user: {
          _id: user._id,
          login_name: user.login_name,
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
    });
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
})

//Logout
router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    })
})

module.exports = router;
