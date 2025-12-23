const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel")
const router = express.Router();

// URL: /api/user/list
router.get("/list", async(req, res) => {
  try {
    const userList = await User.find({}, "_id first_name last_name").lean();
    
    const promises = userList.map(async(user) => {
      const photoCnt = await Photo.countDocuments({user_id : user._id})
      return {
        ...user,
        count_photo : photoCnt
      }
    });

    const userResponse = await Promise.all(promises);

    if (!userResponse || userResponse === 0) {
      res.status(404).json({error : "Khong tim thay nguoi dung"})
    }
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({error})
  }
})

// URL: /api/user/:id
router.get("/:id", async(req, res) => {
  const userId = req.params.id; 

  try {
    const userDetail = await User.findById(userId, "_id first_name last_name location description occupation");
    if (!userDetail || userDetail.length === 0) {
      res.status(400).json({error: "Khong tim thay thong tin nguoi dung"})
    }
    res.json(userDetail)
  } catch(error) {
    res.status(500).json({error})
  }
})


  


module.exports = router;