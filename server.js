require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "Wf6hKgRx7kJ&g*ebC98A",
    saveUninitialized: true,
    resave: true,
    admin: false,
  })
);
app.use(
  bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);
app.use(cors());

const pokemonProfile = require("./src/pokemon");
const timeline = require("./src/timeline");
const cart = require("./src/cart");

//-------------------- MONGOOSE SETUP --------------------//

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
  admin: Boolean,
});
const userModel = mongoose.model("users", userSchema);

function auth(req, res, next) {
  req.session.authenticated ? next() : res.redirect("/login");
}
function admin(req, res, next) {
  req.session.admin
    ? next()
    : res.send(
        `<p style="font-family:monospace">You are not authorized to access that page.<p>`
      );
}

app.use("/pokemon", auth, pokemonProfile);
app.use("/timeline", auth, timeline);
app.use("/cart", auth, cart);

app.listen(process.env.PORT || 5001, function (err) {
  if (err) printError(err);
});

//-------------------- USER ACCOUNT ROUTES --------------------//

app.get("/", function (req, res) {
  res.render("main");
});

app.get("/game", auth, function (req, res) {
  res.render("game");
});

app.get("/login", function (req, res) {
  res.render("login", {
    username: "",
    message: "",
  });
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;
  userModel
    .find({ username: username, password: password })
    .then(function (result) {
      if (result.length) {
        req.session.authenticated = true;
        req.session.username = username;
        req.session.id = result[0]._id;
        if (result[0].admin) {
          req.session.admin = true;
          res.redirect("/admin");
        } else {
          req.session.admin = false;
          res.redirect("/account");
        }
      } else {
        req.session.authenticated = false;
        res.render("login", {
          username: username,
          message: "Username or password invalid!",
        });
      }
    });
});

app.get("/account", auth, function (req, res) {
  userModel.findOne({ username: req.session.username }).then(function (result) {
    const { username, email, added } = result;
    res.render("account", {
      username: username,
      email: email,
      added: added,
    });
  });
});

app.get("/register", function (req, res) {
  res.render("newaccount", {
    email: "",
    message: "",
  });
});

app.post("/register", function (req, res) {
  const { username, email, password } = req.body;
  userModel.find({ username: username }, function (err, result) {
    console.log({ result });
    if (err) {
      printError(err);
    } else {
      if (result.length) {
        // console.log("User already exists");
        res.render("newaccount", {
          email: email,
          message: "That username already exists!",
        });
      } else {
        addNewUserToDB(username, email, password, req, res);
      }
    }
  });
});
function addNewUserToDB(username, email, password, req, res) {
  var time = new Date();
  userModel.create(
    {
      username: username,
      email: email,
      password: password,
      added: time.toLocaleDateString(),
    },
    function (err, data) {
      if (err) {
        printError(err);
      } else {
        // console.log("New user account created: \n" + data);
        req.session.authenticated = true;
        req.session.username = username;
        res.redirect("/account");
      }
    }
  );
}

// add middleware: auth, admin,
app.get("/admin", function (req, res) {
  // userModel.find().then((users) => {
  res.render("admin");
  // });
});

app.get("/getUser/:id", function (req, res) {
  userModel.find({ _id: req.params.id }).then((users) => {
    res.send(users[0]);
  });
});

app.get("/getAllUsers", function (req, res) {
  userModel.find().then((users) => {
    res.send(users);
  });
});

app.get("/deleteUser/:id", function (req, res) {
  userModel.deleteOne({ _id: req.params.id }).then((data) => {
    res.send("Deleted");
  });
});
