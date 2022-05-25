firstCard = undefined;
secondCard = undefined;
carHasBeenFlipped = false;
matches = 0;

// corner cases:
// if click same card twice
// after match prevent clicking on those cards
//  print message when 3 matches made
// grab images randomly from API
// timer for games 2 mins

function setup() {
  $(".game-card").on("click", function () {
    $(this).toggleClass("flip");

    if (!carHasBeenFlipped) {
      // captured first card
      firstCard = $(this).find(".card-face")[0];
      //   console.log(firstCard);
      cardHasBeenFlipped = true;
    } else {
      secondCard = $(this).find(".card-face")[0];
      cardHasBeenFlipped = false;
      console.log({ firstCard, secondCard });

      if (
        $(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")
      ) {
        console.log("Match!");
        matches++;
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().off("click");
      } else {
        console.log("Not a atch!");
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().removeClass(".flip");
          $(`#${secondCard.id}`).parent().removeClass(".flip");
        }, 2000);
      }
    }
    // check for match

    // reset
    // firstCard = undefined;
    // secondCard = undefined;
  });
}

$(document).ready(setup);
