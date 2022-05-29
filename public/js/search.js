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
      loadPokemonCards(pokemonSearchList);
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
        success: async (data) => {
          if (data.id) {
            logEvent(`Searched for ${pokemonName}`);
            window.location.href = `/pokemon/profile/${data.id}`;
          } else {
            alert("A pokemon by that name does not exist.");
          }
        },
      });
    }
  }
}

function setup() {
  $("#pokemon_name").on("keydown", searchPokemonByName);
}
$(document).ready(setup);
