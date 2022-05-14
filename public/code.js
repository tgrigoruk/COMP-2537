// original pokeapi: "https://pokeapi.co/api/v2/";
// const is_heroku = process.env.IS_HEROKU || false;
// const pokeapiUrl = is_heroku
//   ? "https://fathomless-gorge-70141.herokuapp.com/"
//   : "http://localhost:5002/";

const pokeapiUrl = "https://fathomless-gorge-70141.herokuapp.com/";
pokemonSearchList = [];
async function searchPokemons() {
  searchUrl = $(this).val();
  await $.ajax({
    type: "GET",
    url: searchUrl,
    success: (data) => {
      if (searchUrl.includes("pokemon-color")) {
        pokemonSearchList = data.pokemon_species.map((pokemon) => {
          return pokemon.name;
        });
      } else {
        pokemonSearchList = data.pokemon.map((pokemon) => {
          return pokemon.pokemon.name;
        });
      }
      loadPokemonCards(pokemonSearchList);
      // createButtons(pokemonSearchList);
    },
  });
}
function searchPokemonByName(keypress) {
  if (keypress.keyCode == 13) {
    pokemonName = $(this).val().toLowerCase();
    if (/[^a-z]/i.test(pokemonName)) {
      alert("Invalid name entered - must contain only letters.");
    } else {
      $.ajax({
        type: "GET",
        url: `${pokeapiUrl}pokemon/${pokemonName}`,
        error: () => {
          alert("A pokemon by that name does not exist.");
        },
        success: (data) => {
          window.location.href = `/profile/${data.id}`;
        },
      });
    }
  }
}

async function loadDropdowns() {
  const searchTypes = ["type", "ability", "pokemon-color"];
  for (i = 0; i < searchTypes.length; i++) {
    await $.ajax({
      type: "GET",
      url: pokeapiUrl + searchTypes[i],
      success: (data) => {
        // console.log(searchTypes[i]);
        // console.log(data.results);
        options = "";
        for (j = 0; j < data.results.length; j++) {
          options += `<option value=${data.results[j].url}>${data.results[j].name}</option>`;
        }
        let searchType = searchTypes[i];
        if (searchType == "pokemon-color") searchType = "color";
        $(`#pokemon_${searchType}`).html(options);
      },
    });
  }
}

let main_html = "";
function makePokemonCard(pokemon) {
  pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  return `
    <div class="pokemon_card">
      <a href="/profile/${pokemon.id}" onclick="profileViewed('${pokemonName}')"> 
      <h3 class="pokemon_id">#${pokemon.id}</h3>
      <div class="image_container">
          <img src="${pokemon.sprites.other["official-artwork"].front_default}">
      </div>
      <h2 class="pokemon_title">${pokemonName}</h2>
      </a>
    </div>`;
}
async function loadPokemonCards(pokemonIdList) {
  main_html = "";
  for (i = 0; i < 9; i++) {
    await $.ajax({
      type: "GET",
      url: `${pokeapiUrl}pokemon/${pokemonIdList[i]}`,
      success: (pokemon) => {
        if (pokemon) main_html += makePokemonCard(pokemon);
      },
    });
  }
  $("main").html(main_html);
}

// e.g. "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20"
function changePage() {
  buttonPressed = $(this).val();
}
function createButtons(pokemonList) {
  pageCount = Math.floor(pokemonList.length / 9) + 1;
}

function randomPokemons(number) {
  randomArr = [];
  for (i = 0; i < number; i++) {
    randomArr.push(Math.floor(Math.random() * 900) + 1);
  }
  return randomArr;
}

async function setup() {
  await loadDropdowns();
  await loadPokemonCards([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  $("select").change(searchPokemons);
  $("#pokemon_name").on("keydown", searchPokemonByName);
  // $(".page-button").on("click", changePage);
}

$(document).ready(setup);
