const express = require("express");
const session = require("express-session");
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

const pokemon = require("./pokemon");
app.use("/pokemon", pokemon);

const timeline = require("./timeline");
app.use("/timeline", timeline);

app.use(
  session({
    secret: "blahblahblah",
    saveUninitialized: true,
    resave: true,
  })
);

function auth(req, res, next) {
  req.session.authenticated ? next() : res.redirect("/login");
}

let users = [
  {
    username: "foo",
    password: "bar",
    cart: [
      { id: 1, price: 42.25, quantity: 2 },
      { id: 3, price: 31.5, quantity: 5 },
    ],
  },
  { username: "abc", password: "123", cart: [] },
];

app.listen(process.env.PORT || 5001, function (err) {
  if (err) console.log(err);
});

//---------- ROUTES ----------//

app.get("/", auth, function (req, res) {
  console.log("goto main page");
  res.send(`Hello ${req.session.user}!`);
});

app.get("/login", auth, function (req, res) {
  res.render("login", {
    username: "",
    message: "",
  });
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;
  matchedUsers = users.filter(
    (u) => u.username === username && u.password === password
  );
  if (matchedUsers.length == 1) {
    req.session.authenticated = true;
    req.username = username;
    res.redirect("/");
  } else {
    req.session.authenticated = false;
    res.render("login", {
      username: username,
      message: "Username or password invalid.",
    });
  }
});

// app.get("/login/:user/:password", function (req, res) {

//   res.send(`Login`);
// });

app.get("/userProfile/:name", function (req, res) {});
