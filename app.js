//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UsersRoute");
const bodyParser = require("body-parser");
const taskRoutes = require("./routes/TasksRoute");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

//variable default
const PORT = process.env.PORT;

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, uuidv4());
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    return callback(null, new Error("file type not true"));
  }
};

//Intantiate app
const app = express();

//use static
app.use("images/", express.static(path.join(__dirname, "images/")));

//use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//use multer
app.use(
  multer({
    fileFilter: fileFilter,
    limits: { fileSize: 1000000 },
  }).single("avatar"),
  (err, req, res, next) => {
    res.status(400).send({ message: err.message });
  }
);

//use routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

//connect mongodb and listen port
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
  })
  .catch((err) => console.log(err));
