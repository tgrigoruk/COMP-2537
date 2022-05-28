const pokeapiUrl = "https://pokeapi.co/api/v2/";
const pokemonCardsActive = {};

function createShuffledListOfPairs(numOfPokemon, gridsize) {
  let arr = [];
  for (p = 0; p < numOfPokemon; p++) arr.push(Math.trunc(Math.random() * 900));
  while (arr.length < gridsize / 2) arr = arr.concat(arr);
  arr = arr.slice(0, gridsize / 2);
  arr = arr.concat(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

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

  $("#game-grid").empty();
  let pokemonList = createShuffledListOfPairs(numOfPokemon, rows * cols);
  console.log(pokemonList);
  for (let i = 0; i < rows * cols; i++) {
    await $.ajax({
      type: "GET",
      url: `${pokeapiUrl}pokemon/${pokemonList[i]}`,
      success: (pokemon) => {
        pokemonImage = pokemon.sprites.other["official-artwork"].front_default;
        $("#game-grid").append(
          `
        <div class="game-card">
          <img class="card-face" id="card-${i}" src="${pokemonImage}" alt="" />
          <img class="card-back" src="/images/ball.png" alt="" />
        </div>
      `
        );
        pokemonCardsActive[`card-${i}`] = true;
      },
    });
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
var gameTimer;

function game() {
  // start timer after first card selected
  if (!gameHasBegun) {
    gameHasBegun = true;
    let timeInSeconds = parseInt($("#game-difficulty").val());
    gameTimer = setInterval(timer, 1000);
    function timer() {
      displayTime(timeInSeconds);
      if (timeInSeconds) {
        timeInSeconds -= 1;
      } else {
        clearInterval(gameTimer);
        deactivateCards(pokemonCardsActive);
        $("#win-text").text("You've run out of time!");
      }
    }
  }

  // flip the card and disable all cards
  $(this).toggleClass("flip");
  $(".game-card").off("click");

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
    clearInterval(gameTimer);
    $("#win-text").text("Congrats, you won!");
    deactivateCards(pokemonCardsActive);
  }

  console.log({ pokemonCardsActive });
  //re-enable cards still in play after a cool-down period
  setTimeout(() => {
    for (const [key, value] of Object.entries(pokemonCardsActive)) {
      if (value) $(`#${key}`).parent().on("click", game);
    }
  }, 501);
}

function deactivateCards(cards) {
  for (key of Object.keys(cards)) {
    cards[key] = false;
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
