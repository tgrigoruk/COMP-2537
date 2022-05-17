function addToBasket() {
  console.log(this.val());
}

function setup() {
  $(".add-button").on("click", addToBasket);
}

$(document).ready(setup);
