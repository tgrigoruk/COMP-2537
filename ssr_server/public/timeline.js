const dbUrl = "http://localhost:5001/";

function loadEvents() {
  $.ajax({
    url: dbUrl + "timeline/getAllEvents",
    type: "get",
    success: (allEvents) => {
      console.log(allEvents);
      for (i = 0; i < allEvents.length; i++) {
        let id = allEvents[i]["_id"];
        $("#events").append(
          `
            <div class="event" id="${id}"> 
                <button class="like-button" id="like-${id}">👍</button>
                <button class="delete-button" id="delete-${id}">❌</button>
                <span class="event-hit-counter" id="hits-${id}">${allEvents[i].hits}<span>
                ${allEvents[i].text}
                <span class="event-time">${allEvents[i].time}<span>
            </div>
            
            `
        );
      }
    },
  });
}

var time = new Date();
function addEventProfileViewed() {
  pokemon = this.text().toLowerCase();
  console.log(pokemon);
}

function setup() {
  loadEvents();
  $(".pokemon_card a").on("click", ".pokemon_title", addEventProfileViewed);
}

$(document).ready(setup);
