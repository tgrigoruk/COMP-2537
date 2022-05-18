const express = require("express");
var router = express.Router();

require("dotenv").config();
const mongoUri = process.env.MONGODB_URI;

const mongoose = require("mongoose");
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});
const userModel = mongoose.model("users", userSchema);

router.post("/add/:id", function (req, res) {
  //
});

// console.log({ users });

module.exports = router;
