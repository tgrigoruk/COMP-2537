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

const cart = require("./src/cart");
app.use("/cart", cart);

app.use(
  session({
    secret: "blahblahblah",
    saveUninitialized: true,
    resave: true,
  })
);

//-------------------- MONGOOSE SETUP --------------------//

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
});
const userModel = mongoose.model("users", userSchema);

function auth(req, res, next) {
  req.session.authenticated ? next() : res.redirect("/login");
}
app.listen(process.env.PORT || 5001, function (err) {
  if (err) printError(err);
});

//-------------------- USER ACCOUNT ROUTES --------------------//

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
    req.session.username = username;
    localStorage.setItem("username", username);
    res.redirect("/");
  } else {
    req.session.authenticated = false;
    res.render("login", {
      username: username,
      message: "Username or password invalid!",
    });
  }
});

username = "test";
email = "test@gmail.com";

app.get("/account", function (req, res) {
  res.render("account", { username: username, email: email });
});

function getUserIndex() {
  for (let i = 0; i < users.length; i++) {
    if ((users[i].username = req.session.username)) return i;
  }
  return -1;
}

app.get("/register", function (req, res) {
  res.render("newaccount", {
    email: "",
    message: "",
  });
});

app.post("/register", function (req, res) {
  const { username, email, password } = req.body;
  userModel.find({ name: username }, function (err, result) {
    if (err) {
      printError(err);
    } else {
      if (result.length) {
        log("User already exists");
        res.render("newaccount", {
          email: email,
          message: "That username already exists!",
        });
      } else {
        addNewUserToDB(username, email, password);
      }
    }
  });
});
function addNewUserToDB(username, email, password) {
  userModel.create(
    {
      username: username,
      email: email,
      password: password,
      added: "2022-05-20",
    },
    function (err, data) {
      if (err) {
        printError(err);
      } else {
        console.log("New user account created: \n" + data);
        req.session.authenticated = true;
        req.session.username = username;
        res.redirect('/');
      }
      res.send(data);
    }
  );
}
