require("dotenv").config();
const express = require("express");
var router = express.Router();
const session = require("express-session");
router.use(
  session({
    secret: "Wf6hKgRx7kJ&g*ebC98A",
    saveUninitialized: true,
    resave: true,
  })
);

//-------------------- MONGOOSE SETUP --------------------//

const mongoUri = process.env.MONGODB_URI;
const mongoose = require("mongoose");
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cartSchema = new mongoose.Schema({
  username: String,
  cart: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  orderHistory: [
    {
      total: Number,
      time: Date,
      items: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
    },
  ],
});
const cartModel = mongoose.model("shoppingcarts", cartSchema);

//-------------------- SHOPPING CART ROUTES --------------------//

router.get("/add/:name/:price", function (req, res) {
  const username = req.session.username;
  const itemName = req.params.name;
  const itemPrice = parseInt(req.params.price);

  cartModel.find(
    { username: username, "cart.name": itemName },
    function (err, result) {
      if (err) {
        printError(err);
      } else {
        if (result.length) {
          incrementItemQuantity(username, itemName, 1);
        } else {
          addNewItemToCart(username, itemName, itemPrice);
        }
      }
    }
  );
});
async function incrementItemQuantity(username, itemName, amount) {
  cartModel
    .updateOne(
      { username: username, "cart.name": itemName },
      {
        $inc: { "cart.$.quantity": amount },
      }
    )
    .then(function (doc) {
      // log(doc);
    })
    .catch(function (err) {
      printError(err);
    });
}
function addNewItemToCart(username, itemName, itemPrice) {
  const newCartItem = { name: itemName, price: itemPrice, quantity: 1 };
  cartModel.updateOne(
    { username: username },
    { $push: { cart: newCartItem } },
    { upsert: true },
    function (err, updateResult) {
      if (err) {
        printError(err);
      } else {
        // log({ updateResult })
      }
    }
  );
}
function removeItemFromCart(username, itemName) {
  cartModel.updateOne(
    {
      username: username,
    },
    { $pull: { cart: { name: itemName } } },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        // console.log("Deleted: \n" + JSON.stringify(data));
        // res.send({ quantity: 0 });
      }
    }
  );
}

router.get("/quantity/:name/:amount", async function (req, res) {
  const username = req.session.username;
  let { name, amount } = req.params;
  amount = parseInt(amount);
  if (amount) {
    await incrementItemQuantity(username, name, amount);
    cartModel.findOne(
      { username: username },
      { cart: { $elemMatch: { name: name } } },
      function (err, data) {
        if (err) {
          printError(err);
        } else {
          const quantity = data.cart[0].quantity;
          if (quantity < 1) removeItemFromCart(username, name);
          res.send({ quantity: quantity });
        }
      }
    );
  } else {
    removeItemFromCart(username, name);
    res.send({ quantity: 0 });
  }
});

router.get("/empty", function (req, res) {
  const username = req.session.username;
  cartModel
    .updateOne(
      { username: username },
      {
        $set: { cart: [] },
      }
    )
    .then(function (doc) {
      res.send("Cart emptied");
    })
    .catch(function (err) {
      printError(err);
    });
});

router.get("/view", function (req, res) {
  res.render("cart");
});

router.get("/getCart", function (req, res) {
  const username = req.session.username;
  cartModel.findOne({ username: username }, function (err, data) {
    if (err) {
      printError(err);
    } else {
      // res.send(data.cart);
      if (data) {
        res.send(data.cart);
      } else {
        res.send([]);
      }
    }
  });
});

router.post("/checkout", async function (req, res) {
  const username = req.session.username;
  const { total, time } = req.body;
  const cart = await cartModel
    .findOne({ username: username })
    .then(function (data) {
      const order = { time: time, total: total, items: data.cart };
      // log(order);
      cartModel.updateOne(
        { username: username },
        { $push: { orderHistory: order } },
        { upsert: true },
        function (err, pushResponse) {
          if (err) {
            printError(err);
          } else {
            res.send("Order checkout out");
          }
        }
      );
    });
});

router.get("/orderHistory", async function (req, res) {
  const username = req.session.username;
  const histroy = await cartModel
    .findOne({ username: username })
    .then(function (data) {
      if (data) {
        res.send(data.orderHistory);
      } else {
        res.send([]);
      }
    });
});

//-------------------- HELPER FUNCTIONS --------------------//

function log(e) {
  console.log(e);
}
function printError(err) {
  console.log(`Error: ${err}`);
}

module.exports = router;
