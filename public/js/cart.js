function loadCartItems() {
  $("#cart-items").empty();
  $.ajax({
    url: "/cart/getCart",
    type: "GET",
    success: (cart) => {
      console.log({ cart });
      if (cart) {
        for (i = 0; i < cart.length; i++) {
          if (cart[i].quantity < 1) continue;
          parity = i % 2 ? "odd" : "even";
          let name = cart[i].name;
          $("#cart-items").prepend(
            `
            <div class="cart-item row-${parity}" id="item-${name}"> 
              ${capitalize(name)}
              <span class="cart-item-price">$${cart[i].price}</span>  
              <div class="quantity-container">
                <button class="quantity-button" onclick="changeQuantity('${name}', -1)">-</button>
                <span id="${name}-quantity" class="cart-item-quantity">${cart[i].quantity}</span>            
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
  const currQuantity = amount ? parseInt($(`#${name}-quantity`).text()) + amount : 0;
  $.ajax({
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
