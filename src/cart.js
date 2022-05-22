const express = require("express");
var router = express.Router();
const session = require("express-session");
const res = require("express/lib/response");

//-------------------- MONGOOSE SETUP --------------------//

require("dotenv").config();
const mongoUri = process.env.MONGODB_URI;

const mongoose = require("mongoose");
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cartSchema = new mongoose.Schema({
  username: String,
  cart: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  orderHistory: [{
    amount: Number,
    datefulfilled: Date,
    items: [{
      name: String,
      price: Number,
      quantity: Number
    }]
  }],
});
const cartModel = mongoose.model("shoppingcarts", cartSchema);

//-------------------- SHOPPING CART ROUTES --------------------//

username = 'test';

router.get("/add/:name/:price", function (req, res) {
  let username = "test";
  // const {username} = req.session
  const itemName = req.params.name;
  const itemPrice = parseInt(req.params.price);
  console.log(`server.js route - name: ${itemName} , price: ${itemPrice}`);

  cartModel.find({ username: username, "cart.name": itemName }, function (err, result) {
    // console.log({ result });
    if (err) {
      printError(err);
    } else {
      if (result.length) {
        log({ result });
        incrementItemQuantity(username, itemName, 1);
      } else {
        addNewItemToCart(username, itemName, itemPrice);
      }
    }
  });
});
function incrementItemQuantity(username, itemName, amount) {
  let incrementResult = false;
  cartModel.updateOne(
    { username: username, "cart.name": itemName },
    { $inc: { "cart.$.quantity": amount } },
    function (err, updateResult) {
      if (err) {
        printError(err);
      } else {
        // log({ updateResult });
      }
    });
  return incrementResult;
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

router.get("/increment/:name/:amount", async function (req, res) {
  // console.log(req.params);
  const { name, amount } = req.params;
  await incrementItemQuantity(username, name, amount);
  cartModel.findOne(
    { username: username },
    { cart: { $elemMatch: { name: name } } },
    function (err, data) {
      if (err) {
        printError(err);
      } else {
        res.send({ quantity: data.cart[0].quantity });
      }
    });
});

router.get("/remove/:name", function (req, res) {
  // remove one or all
});


router.get("/finalizeOrder", function (req, res) {
  // move items to orderHistroy and remove all
});

router.get("/view", function (req, res) {
  res.render('cart');
});

router.get("/getCart", function (req, res) {
  cartModel.findOne({ username: username }, function (err, response) {
    if (err) {
      printError(err);
    } else {
      res.send(response.cart);
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