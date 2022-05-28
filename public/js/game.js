const pokeapiUrl = "https://pokeapi.co/api/v2/";
const pokemonCardsActive = {};

async function createBoard() {
  const rows = parseInt($("#game-dims").val());
  const cols = rows == 6 ? 6 : 4;

  const numOfPokemon = parseInt($("#game-pokemons").val());
  const timelimit = $("#game-difficulty").val();
  displayTime(timelimit);
  // console.log({
  //   rows: rows,
  //   cols: cols,
  //   pokemon: numOfPokemon,
  //   difficulty: difficulty,
  // });

  let pokemonList = [];
  for (p = 0; p < numOfPokemon; p++) {
    let randomPokemon = Math.trunc(Math.random() * 900);
    let pokemonImage = "";
    await $.ajax({
      type: "GET",
      url: `${pokeapiUrl}pokemon/${randomPokemon}`,
      success: (pokemon) => {
        pokemonImage = pokemon.sprites.other["official-artwork"].front_default;
      },
    });
    pokemonList.push(pokemonImage);
  }

  $("#game-grid").empty();
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
  $("#game-grid").css(
    "grid-template",
    `repeat(${rows}, 1fr) / repeat(${cols}, 1fr)`
  );
  $("#game-grid").css("aspect-ratio", `${cols}/${rows} `);
  $(".game-card").on("click", game);
}

firstCard = undefined;
secondCard = undefined;
cardHasBeenFlipped = false;
matches = 0;
gameHasBegun = false;

function game() {
  if (!gameHasBegun) {
    let timeInSeconds = parseInt($("#game-difficulty").val());
    startTimer(timeInSeconds);
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
      $("#matches-display").text(matches);
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
    // alert("You win the game!");
    $("#win-text").text("Congrats, you won!");
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

function startTimer(timeInSeconds) {
  const gameTimer = setInterval(timer, 1000);
  function timer() {
    displayTime(timeInSeconds);
    if (timeInSeconds) {
      timeInSeconds -= 1;
    } else {
      clearInterval(gameTimer);
      alert("You've run out of time!");
    }
  }
}

function displayTime(time) {
  let minutes = Math.trunc(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  $("#timer-display").text(`${minutes}:${seconds}`);
}

function setup() {
  createBoard();
  $("select").on("change", createBoard);
}

$(document).ready(setup);
