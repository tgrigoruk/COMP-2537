const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
const cors = require("cors");
app.use(cors());
const bodyparser = require("body-parser");
app.use(
  bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);
const https = require("https");
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
const eventModel = mongoose.model("timelineEvents", eventSchema);

app.listen(process.env.PORT || 5001, function (err) {
  if (err) console.log(err);
});

//---------- ROUTES ---------//

app.get("/profile/:id", function (req, res) {
  const url = `https://fathomless-gorge-70141.herokuapp.com/pokemon/${req.params.id}`;
  data = "";

  // use http if local DB, otherwise use https
  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk;
    });
    https_res.on("end", function () {
      // console.log("view profile for " + JSON.parse(data).name);
      res.render("profile.ejs", extractPokemonData(data));
    });
  });
});
function extractPokemonData(data) {
  data = JSON.parse(data);
  stats = Object.assign(
    {},
    { base_xp: data.base_experience },
    ...data.stats.map((stat) => ({
      [stat.stat.name]: stat.base_stat,
    }))
  );
  abilities = data.abilities.map((ability) => {
    return ability.ability.name;
  });
  pokemonData = {
    name: data.name[0].toUpperCase() + data.name.slice(1),
    img: data.sprites.other["official-artwork"].front_default,
    stats: stats,
    abilities: abilities,
  };
  return pokemonData;
}

app.get("/timeline/getAllEvents", function (req, res) {
  eventModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
    }
    res.send(data);
  });
});

app.post("/timeline/insert", function (req, res) {
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

app.get("/timeline/like/:id", function (req, res) {
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

app.get("/timeline/remove/:id", function (req, res) {
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

app.get("/timeline/removeAll", function (req, res) {
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
