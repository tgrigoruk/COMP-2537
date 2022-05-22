const express = require("express");
var router = express.Router();
const session = require("express-session");

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

username = 'test'

router.get("/add/:name/:price", function (req, res) {
  let username = "test"
  // const {username} = req.session
  const itemName = req.params.name;
  const itemPrice = parseInt(req.params.price)
  console.log(`server.js route - name: ${itemName} , price: ${itemPrice}`)

  cartModel.find({ username: username, "cart.name": itemName }, function (err, result) {
    console.log({ result });
    if (err) {
      printError(err)
    } else {
      if (result.length) {
        log({ result })
        incrementItemQuantity(username, itemName)
      } else {
        addNewItemToCart(username, itemName, itemPrice)
      }
    }
  })
});
function incrementItemQuantity(username, itemName) {
  cartModel.updateOne(
    { username: username, "cart.name": itemName },
    { $inc: { "cart.$.quantity": 1 } },
    function (err, updateResult) {
      if (err) {
        printError(err)
      } else {
        log({ updateResult })
      }
    })
}
function addNewItemToCart(username, itemName, itemPrice) {
  const newCartItem = { name: itemName, price: itemPrice, quantity: 1 }
  log({ newCartItem })
  cartModel.updateOne(
    { username: username },
    { $push: { cart: newCartItem } },
    { upsert: true },
    function (err, updateResult) {
      if (err) {
        printError(err)
      } else {
        log({ updateResult })
      }
    }
  )
}

//-------------------- HELPER FUNCTIONS --------------------//

function log(e) {
  console.log(e)
}
function printError(err) {
  console.log(`Error: ${err}`)
}

module.exports = router;