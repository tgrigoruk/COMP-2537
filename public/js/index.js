// const pokeapiUrl = "https://fathomless-gorge-70141.herokuapp.com/";
const pokeapiUrl = "http://localhost:5002/";

async function loadDropdowns() {
  const searchTypes = ["type", "ability", "pokemon-color"];
  for (i = 0; i < searchTypes.length; i++) {
    await $.ajax({
      type: "GET",
      url: `${pokeapiUrl}search/${searchTypes[i]}/all`,
      success: (data) => {
        let options = data.results;
        // console.log(searchTypes[i]);
        // console.log({ options });
        optionsHtml = "";
        for (j = 0; j < options.length; j++) {
          // if using origi
          optionsHtml += `<option value=${options[j].name}>${options[j].name}</option>`;
        }
        let searchType = searchTypes[i];
        if (searchType == "pokemon-color") searchType = "color";
        $(`#pokemon_${searchType}`).html(optionsHtml);
      },
    });
  }
}

let main_html = "";
function makePokemonCard(pokemon) {
  // console.log(pokemon.name);
  pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  return `
    <div class="pokemon_card">
      <div class="card_header">
        <h3 class="pokemon_id">#${pokemon.id}</h3>
        <button type="button" class="add-button" onclick=addToBasket("${pokemon.id}")>add</button>
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

function randomPokemons(number) {
  randomArr = [];
  for (i = 0; i < number; i++) {
    randomArr.push(Math.floor(Math.random() * 900) + 1);
  }
  return randomArr;
}

function showHistory() {
  // show/hide the history panel
}

function setDropdown(dropdownId) {
  $(`#${dropdownId}`).change(function () {
    let searchParam = $(`#${dropdownId} option:selected`).text();
    // console.log($(this).attr("name"));
    searchPokemons(dropdownId.split("_")[1], searchParam);
  });
}

async function setup() {
  await loadDropdowns();
  await loadPokemonCards([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  setDropdown("pokemon_type");
  setDropdown("pokemon_ability");
  setDropdown("pokemon_color");
  // $(".page-button").on("click", changePage);
}

$(document).ready(setup);
