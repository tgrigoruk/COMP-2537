const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");

const https = require("https");

app.listen(5001, function (err) {
  if (err) console.log(err);
});

const pokeurl = "https://pokeapi.co/api/v2/ability/"; // + id or name

app.get("/", function (req, res) {
  res.send("<h1>GET request to homepage</h1>");
});

app.get("profile/:id", function (req, res) {
  https.get(pokeurl + req.params.id, function (https_res) {
    https_res.on("data", function (data) {
      console.log(data);
    });
  });

  req.render("profile.ejs", {
    id: req.params.id,
    name: "",
  });
});
