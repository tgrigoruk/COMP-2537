const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
const cors = require("cors");
app.use(cors());

const https = require("https");

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

// for Heroku prepend port number with:    process.env.PORT ||
app.listen(5001, function (err) {
  if (err) console.log(err);
});

//---------- ROUTES ---------//

// let pokeapiUrl = "https://pokeapi.co/api/v2/";
let pokeapiUrl = "http://localhost:5002/";

app.get("/profile/:id", function (req, res) {
  const url = pokeapiUrl + req.params.id;
  data = "";
  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk;
    });
    https_res.on("end", function () {
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
  // console.log(pokemonData);
  return pokemonData;
}

app.get("/timeline/getAllEvents", function (req, res) {
  // console.log("received a request for "+ req.params.city_name);
  eventModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Insertion is successful");
  });
});

app.put("/timeline/insert", function (req, res) {
  console.log(req.body);
  eventModel.create(
    {
      text: req.body.text,
      time: req.body.time,
      hits: req.body.hits,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send(data);
    }
  );
});

app.get("/timeline/inreaseHits/:id", function (req, res) {
  console.log(req.params);
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
        console.log("Data " + data);
      }
      res.send("Update is good!");
    }
  );
});

app.get("/timeline/remove/:id", function (req, res) {
  // console.log(req.params)
  eventModel.remove(
    {
      _id: req.params.id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Delete is good!");
    }
  );
});
