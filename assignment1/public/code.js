main_html = "";

function loadDropdowns() {
  ["type", "nature", "location"].forEach((searchType) => {
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

function processPokeRes(data) {
  //   console.log(data);
  pokemonName = data.name[0].toUpperCase() + data.name.slice(1);
  main_html += `<div class="pokemon_card">
    <h2 class="pokemon_title">${pokemonName}</h2>
    <a href="/profile/${data.id}"> 
    <div class="image_container">
    <img src="${data.sprites.other["official-artwork"].front_default}">
    </a>
    </div>
    </div>`;
}

async function loadPokemonCards() {
  for (i = 1; i <= 9; i++) {
    if (i % 3 == 1) {
      main_html += `<div class="images_group">`;
    }

    index = Math.floor(Math.random() * 900) + 1;

    await $.ajax({
      type: "GET",
      url: "https://pokeapi.co/api/v2/pokemon/" + index,
      success: processPokeRes,
    });

    if (i % 3 == 0) {
      main_html += `</div>`;
    }
  }
  $("main").html(main_html);
}

function setup() {
  loadDropdowns();
  loadPokemonCards();
  $("#pokemon_type").change(() => {
    pokemon_type = $("#pokemon_type option:selected").val();
    alert(pokemon_type);
  });
}

$(document).ready(setup);
