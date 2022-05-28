const pokeapiUrl = "https://pokeapi.co/api/v2/";

let pokemonCardsActive = {};
async function createBoard() {
  const cols = 4;
  const rows = parseInt($("#game-dims").val());
  const numOfPokemon = parseInt($("#game-pokemons").val());
  const difficulty = parseInt($("#game-difficulty").val());
  console.log({
    rows: rows,
    cols: cols,
    pokemon: numOfPokemon,
    difficulty: difficulty,
  });

  $("#game-grid").empty();
  let pokemonList = [];
  let pokemonImage = "";

  for (p = 0; p < numOfPokemon; p++) {
    let randomPokemon = Math.trunc(Math.random() * 900);
    await $.ajax({
      type: "GET",
      url: `${pokeapiUrl}pokemon/${randomPokemon}`,
      success: (pokemon) => {
        pokemonImage = pokemon.sprites.other["official-artwork"].front_default;
      },
    });
    pokemonList.push(pokemonImage);
  }
  for (i = 0; i < rows * cols; i++) {
    pokemonCardsActive[`card-${i}`] = true;
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
  $("#timer-display").text(`${Math.trunc(6 / difficulty)}:00`);
}

firstCard = undefined;
secondCard = undefined;
cardHasBeenFlipped = false;
matches = 0;
gameHasBegun = false;

// corner cases:
// if click same card twice
// after match prevent clicking on those cards
//  print message when 3 matches made
// grab images randomly from API
// timer for games 2 mins

function game() {
  if (!gameHasBegun) {
    startTimer();
    gameHasBegun = true;
  }
  $(this).toggleClass("flip");
  $(".game-card").off("click");
  console.log($(this).find(".card-face")[0].id);

  if (!cardHasBeenFlipped) {
    firstCard = $(this).find(".card-face")[0];
    pokemonCardsActive[firstCard.id] = false;
    cardHasBeenFlipped = true;
  } else {
    secondCard = $(this).find(".card-face")[0];
    $(`#${secondCard.id}`).parent().off("click", game);
    cardHasBeenFlipped = false;

    if (
      $(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")
    ) {
      console.log("Match!");
      matches++;
      pokemonCardsActive[firstCard.id] = false;
      pokemonCardsActive[secondCard.id] = false;
    } else {
      console.log("Not a match!");
      pokemonCardsActive[firstCard.id] = true;
      pokemonCardsActive[secondCard.id] = true;
      setTimeout(() => {
        $(`#${firstCard.id}`).parent().removeClass("flip");
        $(`#${secondCard.id}`).parent().removeClass("flip");
      }, 500);
    }
  }
  if (matches == 3) {
    alert("You win the game!");
    for (key of Object.keys(pokemonCardsActive)) {
      pokemonCardsActive[key] = false;
    }
  }

  setTimeout(() => {
    for (const [key, value] of Object.entries(pokemonCardsActive)) {
      if (value) $(`#${key}`).parent().on("click", game);
    }
  }, 501);
}

function startTimer() {
  // let timer = duration, mins, secs;
  // const minutes = parseInt($("#game-difficulty").val());
  // const display = $("#timer-display");
  // setInterval(function(){
  //   display.textContent =
  // })
}

function setup() {
  createBoard();
  $("select").on("change", createBoard);
}

$(document).ready(setup);
