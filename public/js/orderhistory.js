function loadOrders() {
    $("#orders").empty();
    $.ajax({
        url: "/cart/orderHistory",
        type: "get",
        success: (orders) => {
            // console.log({ cart });
            if (orders.length) {
                // currency code from https://flaviocopes.com/how-to-format-number-as-currency-javascript/
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                });
                // end currency code
                for (i = 0; i < orders.length; i++) {
                    const { total, time, items } = orders[i];
                    parity = i % 2 ? "odd" : "even";
                    let order = `
                        <div class="order-row row-${parity}"> 
                        <div>Order at ${time} for ${formatter.format(total)}</div>
                        <div class="order-items">
                        `;
                    items.forEach((item) => {
                        order += `<div class="order-item">• ${capitalize(item.name)} (${item.quantity} @ ${formatter.format(item.price)})</div>`;
                    });
                    order += "</div></div>";
                    $("#orders").prepend(order);
                }
            } else {
                $("#orders").append(`<p id="cart-empty">Cart is currently empty</p>`);
            }
        },
    });
}
function capitalize(text) {
    return text[0].toUpperCase() + text.slice(1);
}

function setup() {
    loadOrders();
}
$(document).ready(setup);