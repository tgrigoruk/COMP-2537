function addToCart(name, base_xp) {
  $.ajax({
    url: `/cart/add/${name}/${base_xp}`,
    type: "GET",
    success: (res) => {
      console.log({ res })
    },
  });
}

function setup() {
  // $(".add-button").on("click", addToBasket);
}

$(document).ready(setup);
