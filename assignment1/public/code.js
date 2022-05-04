main_html = "";

function loadDropdowns() {
  ["type", "ability", "location"].forEach((searchType) => {
    $.ajax({
      type: "GET",
      url: `https://pokeapi.co/api/v2/${searchType}/`,
      success: (data) => {
        options = "";
        data.results.forEach((result) => {
          options += `<option value=${result.url}>${result.name}</option>`;
        });
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
        <h3 class="pokemon_id">#${pokemon.id}</h3>
        <a href="/profile/${pokemon.id}"> 
        <div class="image_container">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}">
            
        </div>
        </a>
        <h2 class="pokemon_title">${pokemonName}</h2>
    </div>`;
}

pokemonSearchList = [];
async function searchPokemons(searchUrl) {
  await $.ajax({
    type: "GET",
    url: searchUrl,
    success: (data) => {
      pokemonSearchList = data.pokemon.map((pokemon) => {
        return pokemon.pokemon.name;
      });
      console.log(pokemonSearchList);
      loadPokemonCards(pokemonSearchList);
    },
  });
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
}

$(document).ready(setup);
