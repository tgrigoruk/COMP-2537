function addToBasket(id) {
  $.ajax({
    url: `/cart/add/${id}`,
    type: "GET",
    success: (res) => {
      console.log(res);
    },
  });
}

function setup() {
  // $(".add-button").on("click", addToBasket);
}

$(document).ready(setup);
