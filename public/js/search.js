// const pokeapiUrl = "https://fathomless-gorge-70141.herokuapp.com/";
// const pokeapiUrl = "http://localhost:5002/";
var time = new Date();

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
      console.log({ pokemonSearchList });
      loadPokemonCards(pokemonSearchList);
    },
  });
}
// async function searchPokemons(searchType, searchParam) {
//   //   console.log({ searchParam, searchType });
//   await $.ajax({
//     type: "GET",
//     url: `${pokeapiUrl}search/${searchType}/${searchParam}`,
//     success: (data) => {
//       //   console.log(data);
//       pokemonSearchList = data.map((pokemon) => {
//         return pokemon.id;
//       });
//       loadPokemonCards(pokemonSearchList);
//     },
//   });
// }

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
          console.log({ data });
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
