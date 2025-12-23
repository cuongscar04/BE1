const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Cấu hình multer để lưu file vào thư mục images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất bằng cách thêm timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// URL: /api/photo/photosOfUser/:id
// Trả về danh sách ảnh của user cùng với comments
router.get("/photosOfUser/:id", async (req, res) => {
  try {
    const photos = await Photo.find({user_id: req.params.id})
      .populate({
        path: 'comments.user_id',
        model: 'Users'
      });

    if (!photos || photos.length === 0) {
      return res.status(404).json({error: "Nguoi dung nay chua upload anh"});
    }

    return res.json(photos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Loi server"});
  }
});

// URL: /api/photo/photos/new
// Upload ảnh mới cho user đang đăng nhập
router.post("/photos/new", upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được tải lên" });
    }

    // Lấy thông tin user từ session (đã được middleware isAuthenticated xử lý)
    const userId = req.session.user._id;

    // Tạo photo object mới
    const newPhoto = new Photo({
      file_name: req.file.filename,
      user_id: userId,
      date_time: new Date(),
      comments: []
    });

    // Lưu vào database
    await newPhoto.save();

    return res.status(201).json(newPhoto);
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;