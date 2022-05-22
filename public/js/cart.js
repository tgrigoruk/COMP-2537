function loadCartItems() {
  $("#cart-items").empty();
  $.ajax({
    url: "/cart/getCart",
    type: "GET",
    success: (cart) => {
      console.log({ cart });
      if (cart) {
        for (i = 0; i < cart.length; i++) {
          parity = i % 2 ? "odd" : "even";
          let name = cart[i].name;
          $("#cart-items").prepend(
            `
            <div class="cart-item row-${parity}" id="${name}"> 
              ${capitalize(name)}
              <span class="cart-item-price">$${cart[i].price}</span>  
              <div class="quantity-container">
                <button class="quantity-button" onclick="changeQuantity('${name}', -1)">-</button>
                <span id="${name}-quantity" class="event-hit-quantity">${cart[i].quantity}</span>            
                <button class="quantity-button" onclick="changeQuantity('${name}', 1)">+</button>
                <button class="delete-button" onclick=removeFromCart('${name}')>remove</button>
              </div>
            </div>
            `
          );
        }
        $("#cart-items").prepend(`<div class="cart-item cart-header">
          <p>Pokemon Name</p><p>Price</p><p style="text-align:center">Quantity</p></div>`);
      } else {
        $("#cart-items").append(`<p id="cart-empty">Cart is currently empty</p>`);
      }
    },
  });
}

function addToCart(name, base_xp) {
  // console.log(name)
  $.ajax({
    url: `/cart/add/${name}/${base_xp}`,
    type: "GET",
    success: (res) => {
      console.log({ res });
    },
  });
}

function changeQuantity(name, amount) {
  console.log(name);
  $.ajax({
    url: `/cart/increment/${name}/${amount}`,
    type: "GET",
    success: (res) => {
      if (res) {
        $(`#${name}-quantity`).text(res.quantity);
      }
    },
  });
}


function removeFromCart(name) {
  // remove item from cart
}


function emptyCart() {
  // empty entire cart

}

function proceedToCheckout() {
  // go to screen showing totals etc.
}

function finalizeOrder() {
  // complete order, add to orderHistory[] and clear cart
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}
function setup() {
  loadCartItems();
}
$(document).ready(setup);
