require("dotenv").config();
const express = require("express");
var router = express.Router();
const session = require("express-session");
router.use(
  session({
    secret: "Wf6hKgRx7kJ&g*ebC98A",
    saveUninitialized: true,
    resave: true,
  })
);

//-------------------- MONGOOSE SETUP --------------------//

const mongoUri = process.env.MONGODB_URI;
const mongoose = require("mongoose");
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const eventSchema = new mongoose.Schema({
  username: String,
  events: [
    {
      text: String,
      hits: Number,
      time: String,
    },
  ],
});
const eventModel = mongoose.model("timelineevents", eventSchema);

//-------------------- TIMELINE EVENTS ROUTES --------------------//

router.get("/getAllEvents", function (req, res) {
  const username = req.session.username;
  eventModel.find({ username: username }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      if (data.length) {
        // console.log(data)
        res.send(data[0].events);
      }
    }
  });
});

router.post("/insert", function (req, res) {
  const username = req.session.username;
  const { text, time } = req.body;
  const newEvent = { text: text, time: time, hits: 1 };
  eventModel.updateOne(
    { username: username },
    { $push: { events: newEvent } },
    { upsert: true },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        // console.log("Inserted: \n" + data);
        res.send("Inserted");
      }
    }
  );
});

router.get("/like/:id", function (req, res) {
  const username = req.session.username;
  eventModel.updateOne(
    {
      username: username,
      "events._id": req.params.id,
    },
    {
      $inc: { "events.$.hits": 1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        // console.log("Liked: \n" + JSON.stringify(data));
        res.send("Liked");
      }
    }
  );
});

router.get("/remove/:id", function (req, res) {
  const username = req.session.username;
  eventModel.updateOne(
    {
      username: username,
    },
    { $pull: { events: { _id: req.params.id } } },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        // console.log("Deleted: \n" + JSON.stringify(data));
      }
      res.send("Removed");
    }
  );
});

router.get("/removeAll", function (req, res) {
  const username = req.session.username;
  eventModel.deleteOne(
    {
      username: username,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        // console.log("Deleted all");
        res.send("Deleted all!");
      }
    }
  );
});

module.exports = router;
