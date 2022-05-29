const express = require("express");
const app = express();
var router = express.Router();

app.use(
  session({
    secret: "blahblahblah",
    saveUninitialized: true,
    resave: true,
  })
);

let users = [
  {
    username: "foo",
    password: "bar",
    cart: [
      { id: 1, price: 42, quantity: 2 },
      { id: 3, price: 31, quantity: 5 },
    ],
  },
  { username: "abc", password: "123", cart: [] },
];

function auth(req, res, next) {
  req.session.authenticated ? next() : res.redirect("/login");
}

router.get("/", auth, function (req, res) {
  res.send(`Hello ${req.session.user}!`);
});

router.get("/login", auth, function (req, res) {
  res.render("login", {
    username: "",
    message: "",
  });
});

router.post("/login", function (req, res) {
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

// router.get("/login/:user/:password", function (req, res) {

//   res.send(`Login`);
// });

router.get("/userProfile/:name", function (req, res) {});

// if using mondgoDB

// const cartItemSchema = new mongoose.Schema({
//   pokemonId: String,
//   quantity: Number,
//   time: String,
// });
// const cartItemModel = mongoose.model("cartItems", cartItemSchema);

module.exports = router;
