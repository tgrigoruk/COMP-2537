const express = require("express");
var router = express.Router();

require("dotenv").config();
const mongoUri = process.env.MONGODB_URI;

const mongoose = require("mongoose");
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const eventSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});
const eventModel = mongoose.model("timelineevents", eventSchema);

router.get("/getAllEvents", function (req, res) {
  eventModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
    }
    res.send(data);
  });
});

router.post("/insert", function (req, res) {
  eventModel.create(
    {
      text: req.body.text,
      time: req.body.time,
      hits: 1,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Inserted: \n" + data);
      }
      res.send(data);
    }
  );
});

router.get("/like/:id", function (req, res) {
  eventModel.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: { hits: 1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Liked: \n" + JSON.stringify(data));
      }
      res.send("Update is good!");
    }
  );
});

router.get("/remove/:id", function (req, res) {
  // console.log(req.params)
  eventModel.deleteOne(
    {
      _id: req.params.id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Deleted: \n" + JSON.stringify(data));
      }
      res.send("Delete is good!");
    }
  );
});

router.get("/removeAll", function (req, res) {
  // console.log(req.params)
  eventModel.deleteMany(
    {
      _hits: { $gt: 0 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Deleted all");
      }
      res.send("Deleted all!");
    }
  );
});

module.exports = router;
