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

const pokemonProfile = require("./src/pokemon");
app.use("/pokemon", pokemonProfile);

const timeline = require("./src/timeline");
app.use("/timeline", timeline);

// const cart = require("./cart");
// app.use("/cart", cart);

app.use(
  session({
    secret: "blahblahblah",
    saveUninitialized: true,
    resave: true,
  })
);

require("dotenv").config();
const mongoUri = process.env.MONGODB_URI;

const mongoose = require("mongoose");
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  added: String,
  cart: [mongoose.Schema.Types.Mixed],
  orderHistory: [mongoose.Schema.Types.Mixed],
  eventHistory: [mongoose.Schema.Types.Mixed],
});
const userModel = mongoose.model("users", userSchema);

function auth(req, res, next) {
  req.session.authenticated ? next() : res.redirect("/login");
}

users = [
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

app.get("/", function (req, res) {
  res.render("main");
});

app.get("/login", function (req, res) {
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

app.get("/newaccount", function (req, res) {
  res.render("newaccount", {
    username: "",
    email: "",
    message: "",
  });
});

app.post("/newaccount", function (req, res) {
  const { username, email, password } = req.body;
  // matchedUsers = users.filter(
  //   (u) => u.username === username && u.password === password
  // );
  // if (matchedUsers.length == 1) {
  //   req.session.authenticated = true;
  //   req.username = username;
  //   res.redirect("/");
  // } else {
  //   req.session.authenticated = false;
  //   res.render("login", {
  //     username: username,
  //     message: "Username or password invalid.",
  //   });
  // }
});

app.get("/account", function (req, res) {
  res.render("account");
});

app.get("/userProfile/:name", auth, function (req, res) {});

app.get("/cart/add/:id", auth, function (req, res) {
  // increment quantity
  const id = req.params.id;
  userCart = users[getUserIndex()].cart;
  if (id in userCart) {
    users[getUserIndex()].cart[id]++;
  } else {
    users[getUserIndex()].cart[id] = 1;
  }
  // res.send(users[getUserIndex()].cart[id]);
  res.send(true);
});

function getUserIndex() {
  for (let i = 0; i < users.length; i++) {
    if ((users[i].username = req.session.username)) return i;
  }
  return -1;
}

app.post("/register", function (req, res) {
  const { username, email, password } = req.body;
  userModel.create(
    {
      username: username,
      email: email,
      password: password,
      added: "2022-05-20",
      cart: [],
      orderHistory: [],
      eventHistory: [],
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("New user account created: \n" + data);
      }
      res.send(data);
    }
  );
});
