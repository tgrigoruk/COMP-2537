const express = require("express");
const app = express();
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

// for Heroku prepend port number with:    process.env.PORT ||
app.listen(5002, function (err) {
  if (err) console.log(err);
});

const pokemonDB = require("./pokemon.json");

app.get("/pokemon/:id", function (req, res) {
  pokemon = pokemonDB.pokemon.filter((p) => {
    return p.id == req.params.id || p.name == req.params.id;
  })[0];
  res.send(pokemon);
});

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

app.get("/type", function (req, res) {
  res.send(pokemonDB.type);
});
app.get("/ability", function (req, res) {
  res.send(pokemonDB.type);
});
app.get("/pokemon-color", function (req, res) {
  res.send(pokemonDB.type);
});
