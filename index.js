const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
app.set("trust proxy", 1);
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AuthRouter = require("./routes/AuthRouter");
const CommentRouter = require("./routes/CommentRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const isAuthenticated = require("./middleware/isAuthenticated");

// Đảm bảo thư mục public/images tồn tại
const dir = "./public/images";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

dbConnect();

app.use(
  session({
    secret: "b22dcat038",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

app.use(
  cors({
    origin: "https://ytqcng-3000.csb.app",
    credentials: true,
  })
);

// Phục vụ các file tĩnh từ thư mục public
app.use("/images", express.static("public/images"));

app.use(express.json());
app.use("/api/user", isAuthenticated, UserRouter);
app.use("/api/photo", isAuthenticated, PhotoRouter);
app.use("/api/comment", isAuthenticated, CommentRouter);
app.use("/api/admin", AuthRouter);
app.use("/api", RegisterRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
