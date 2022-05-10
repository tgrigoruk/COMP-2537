const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");

// for heroku prepend port number with:    process.env.PORT ||
app.listen(5001, function (err) {
  if (err) console.log(err);
});

//---------- ROUTES ---------//

app.get("/", function (req, res) {
  res.send("<h1>GET request to homepage</h1>");
});

app.get("/profile/:id", function (req, res) {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
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
