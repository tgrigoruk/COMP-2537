main_html = "";

function loadDropdowns() {
  ["type", "ability", "pokemon-color"].forEach((searchType) => {
    $.ajax({
      type: "GET",
      url: `https://pokeapi.co/api/v2/${searchType}/`,
      success: (data) => {
        options = "";
        data.results.forEach((result) => {
          options += `<option value=${result.url}>${result.name}</option>`;
        });
        if (searchType == "pokemon-color") searchType = "color";
        $(`#pokemon_${searchType}`).html(options);
      },
    });
  });
}

function makePokemonCard(pokemon) {
  //   console.log(data);
  pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  return `
    <div class="pokemon_card">
      <a href="/profile/${pokemon.id}"> 
      <h3 class="pokemon_id">#${pokemon.id}</h3>
      <div class="image_container">
          <img src="${pokemon.sprites.other["official-artwork"].front_default}">
      </div>
      <h2 class="pokemon_title">${pokemonName}</h2>
      </a>
    </div>`;
}

pokemonSearchList = [];
async function searchPokemons(searchUrl) {
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
      console.log(pokemonSearchList);
      loadPokemonCards(pokemonSearchList);
      createButtons(pokemonSearchList);
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
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
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

async function loadPokemonCards(pokemonIdList) {
  main_html = "";
  for (i = 0; i < 9; i++) {
    // 0, 3, 6
    if (i % 3 == 0) main_html += `<div class="images_group">`;

    await $.ajax({
      type: "GET",
      url: "https://pokeapi.co/api/v2/pokemon/" + pokemonIdList[i],
      success: (pokemon) => {
        main_html += makePokemonCard(pokemon);
      },
    });

    if (i % 3 == 2) main_html += `</div>`;
  }
  $("main").html(main_html);
}

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

function setup() {
  loadDropdowns();
  loadPokemonCards(randomPokemons(9));
  $("select").change(function () {
    searchPokemons(this.value);
  });
  $("#pokemon_name").on("keydown", searchPokemonByName);
  $("button").on("click", changePage);
}

$(document).ready(setup);
