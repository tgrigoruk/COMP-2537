const pokeapiUrl = "https://pokeapi.co/api/v2/";

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
    $(`#pokemon_${searchType}`)
      .change(async function () {
        let searchValue = $(`#pokemon_${searchType} option:selected`).text();
        console.log({ searchValue });
        await searchEvent(searchType, searchValue);
      })
      .change(function () {
        searchPokemons(this.value);
      });
  });
}

let pokemonCardsGrid = "";
function makePokemonCard(pokemon) {
  // console.log(pokemon.name);
  pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  return `
    <div class="pokemon_card">
      <div class="card_header">
        <h3 class="pokemon_id">#${pokemon.id}</h3>
        <button type="button" class="add-button" onclick=addToCart("${pokemon.name}",${pokemon.base_experience})>add</button>
      </div>
      <a href="/pokemon/profile/${pokemon.id}" onclick="profileViewed('${pokemonName}')"> 
      <div class="image_container">
          <img src="${pokemon.sprites.other["official-artwork"].front_default}">
      </div>
      <h2 class="pokemon_title">${pokemonName}</h2>
      </a>
    </div>`;
}
async function loadPokemonCards(pokemonIdList) {
  // console.log(pokemonIdList);
  pokemonCardsGrid = "";
  for (i = 0; i < 9; i++) {
    await $.ajax({
      type: "GET",
      url: `${pokeapiUrl}pokemon/${pokemonIdList[i]}`,
      success: (pokemon) => {
        if (pokemon) pokemonCardsGrid += makePokemonCard(pokemon);
      },
    });
  }
  $("#pokemon-cards-go-here").html(pokemonCardsGrid);
}

function randomIntegersArray(number) {
  randomArr = [];
  for (i = 0; i < number; i++) {
    randomArr.push(Math.floor(Math.random() * 900) + 1);
  }
  return randomArr;
}

function showHistory() {
  // show/hide the history panel
}

async function setup() {
  await loadDropdowns();
  await loadPokemonCards([1, 2, 3, 4, 5, 6, 7, 8, 9]);
}

$(document).ready(setup);
