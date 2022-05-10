const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");

app.use(
  bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/timelineDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const eventSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});
const eventModel = mongoose.model("timelineEvents", eventSchema);

// prepend port number with:    process.env.PORT ||
app.listen(5001, function (err) {
  if (err) console.log(err);
});

//---------- ROUTES ---------//

app.get("/timeline/getAllEvents", function (req, res) {
  // console.log(req.body);
  eventModel.find({}, function (err, data) {
    if (err) {
      // console err
    } else {
      console.log(data);
    }
    res.send(data);
  });
});

app.get("/timeline/update/", function (req, res) {
  eventModel.create({});
});

app.get("/timeline/increaseHits/:id", function (req, res) {
  eventModel.udpateOne(
    { _id: req.params.id },
    { $inc: { hits: 1 } },
    function () {}
  );
});
