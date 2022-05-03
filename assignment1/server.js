const express = require("express");
const app = express();
app.use(express.static("./public"));

app.listen(5001, function (err) {
  if (err) console.log(err);
});

const pokeurl = "https://pokeapi.co/api/v2/ability/"; // + id or name

app.get("/", function (req, res) {
  res.send("<h1>GET request to homepage</h1>");
});
