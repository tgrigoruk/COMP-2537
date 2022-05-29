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
    pokemonNameTitleCase = $(this).val();
    pokemonName = pokemonNameTitleCase.toLowerCase();
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
            await addNameToTimeline(pokemonNameTitleCase);
            window.location.href = `/pokemon/profile/${data.id}`;
          } else {
            alert("A pokemon by that name does not exist.");
          }
        },
      });
    }
  }
}

async function addNameToTimeline(pokemonName) {
  pokemonName = pokemonName[0].toUpperCase() + pokemonName.slice(1);
  await $.ajax({
    url: `/timeline/insert`,
    type: "POST",
    data: {
      text: `Searched for ${pokemonName}`,
      time: time.toLocaleTimeString(),
    },
    success: (data) => {
      loadEvents();
    },
  });
}

function setup() {
  $("#pokemon_name").on("keydown", searchPokemonByName);
}
$(document).ready(setup);
