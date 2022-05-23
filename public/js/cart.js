async function loadCartItems() {
  $("#cart-items").empty();
  await $.ajax({
    url: "/cart/getCart",
    type: "GET",
    success: (cart) => {
      // console.log({ cart });
      if (cart.length) {
        for (i = 0; i < cart.length; i++) {
          if (cart[i].quantity < 1) continue;
          const { price, quantity } = cart[i];

          parity = i % 2 ? "odd" : "even";
          let name = cart[i].name;
          $("#cart-items").prepend(
            `
            <div class="cart-item row-${parity}" id="item-${name}"> 
              ${capitalize(name)}
              <span class="cart-item-price">$${price}</span>  
              <div class="quantity-container">
                <button class="quantity-button" onclick="changeQuantity('${name}', -1)">-</button>
                <span id="${name}-quantity" class="cart-item-quantity">${quantity}</span>            
                <button class="quantity-button" onclick="changeQuantity('${name}', 1)">+</button>
                <button class="remove-button" onclick="changeQuantity('${name}', 0)">remove</button>
              </div>
            </div>
            `
          );
        }
      } else {
        $("#cart-items").append(`<p id="cart-empty">Cart is currently empty</p>`);
      }
    },
  });
  createTotals();
}

async function addToCart(name, base_xp) {
  // console.log(name)
  await $.ajax({
    url: `/cart/add/${name}/${base_xp}`,
    type: "GET",
    success: (res) => {
      console.log({ res });
    },
  });
  createTotals();
}

async function changeQuantity(name, amount) {
  const currQuantity = amount ? parseInt($(`#${name}-quantity`).text()) + amount : 0;
  await $.ajax({
    url: `/cart/quantity/${name}/${amount}`,
    type: "GET",
    success: (res) => {
      if (currQuantity > 0) {
        $(`#${name}-quantity`).text(currQuantity);
      } else {
        $(`#item-${name}`).remove();
      }

      // if (res.quantity > 0) {
      //   $(`#${name}-quantity`).text(res.quantity);
      // } else {
      //   $(`#item-${name}`).remove();
      // }
    },
  });
  createTotals();
}


async function emptyCart() {
  // empty entire cart
  await $.ajax({
    url: `/cart/empty`,
    type: "GET",
    success: (res) => {
      console.log({ res });
      $("#cart-items").empty();
      $("#cart-items").append(`<p id="cart-empty">Cart is currently empty</p>`);
    },
  });
  createTotals();
}

function createTotals() {
  // currency code from https://flaviocopes.com/how-to-format-number-as-currency-javascript/
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
  // end currency code
  let pokemonNumber = 0;
  let subtotal = 0;
  const quantityArr = [];
  const priceArr = [];
  $(".cart-item-quantity").each(function () {
    let quantity = parseInt($(this).text());
    quantityArr.push(quantity);
    pokemonNumber += quantity;
  });
  $(".cart-item-price").each(function () {
    priceArr.push(parseInt($(this).text().slice(1)));
  });
  for (i = 0; i < priceArr.length; i++) {
    subtotal += quantityArr[i] * priceArr[i];
  }

  $("#total-pokemon").text(pokemonNumber);
  $("#total-subtotal").text(formatter.format(subtotal));
  const tax = subtotal * 0.05;
  $("#total-tax").text(formatter.format(tax));
  const total = subtotal + tax;
  $("#total-total").text(formatter.format(total));
  $("#total-total").attr("value", total);
}

var time = new Date();

async function checkout() {
  const total = $("#total-total").attr("value");
  await $.ajax({
    url: `/cart/checkout`,
    type: "POST",
    data: {
      total: total,
      time: time.toISOString()
    },
    success: (res) => {
      emptyCart();
    },
  });
}


function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}
function setup() {
  loadCartItems();
}
$(document).ready(setup);
