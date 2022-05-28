const pokeapiUrl = "https://pokeapi.co/api/v2/";

async function createBoard(rows, cols, numOfPokemon) {
  let pokemonList = [];
  let pokemonImage = "";
  for (p = 0; p < numOfPokemon; p++) {
    let randomPokemon = Math.trunc(Math.random() * 900);
    // pokemonList.push(randomPokemon);
    await $.ajax({
      type: "GET",
      url: `${pokeapiUrl}pokemon/${randomPokemon}`,
      success: (pokemon) => {
        pokemonImage = pokemon.sprites.other["official-artwork"].front_default;
      },
    });
    pokemonList.push(pokemonImage);
  }
  console.log(pokemonList);
  for (i = 0; i < rows * cols; i++) {
    let thisPokemon = Math.trunc(Math.random() * numOfPokemon);
    $("#game-grid").append(
      `
        <div class="game-card">
          <img class="card-face" id="card-${i}" src="${pokemonList[thisPokemon]}" alt="" />
          <img class="card-back" src="/images/ball.png" alt="" />
        </div>
      `
    );
  }
  $("#game-grid").css(" grid-template-rows", `repeat(${cols}, 1fr)`);
  $(".game-card").on("click", game);
}

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

function game() {
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
}

function setup() {
  createBoard(4, 4, 5);
}

$(document).ready(setup);
