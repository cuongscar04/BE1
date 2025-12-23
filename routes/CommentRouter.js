const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel"); 
const router = express.Router();

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  const photo_id = req.params.photo_id;
  const {comment } = req.body;

   if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Hay dang nhap" });
  }
  
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Noi dung binh luan khong duoc de trong" });
  }
  try {
    const photo = await Photo.findById(photo_id);
    if(!photo) {
      return res.status(404).json({message: "Khong tim thay anh"})
    }

    const newComment = {
      comment: comment,
      date_time: new Date(),
      user_id: req.session.user._id
    };

    photo.comments.push(newComment);
    await photo.save()

    res.status(200).json({message: "Them comment thanh cong"})

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
})

module.exports = router;