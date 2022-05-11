const dbUrl = "http://localhost:5001/";
// const dbUrl = "https://fathomless-gorge-70141.herokuapp.com/";

function loadEvents() {
  $("#events").empty();
  $.ajax({
    url: dbUrl + "timeline/getAllEvents",
    type: "get",
    success: (allEvents) => {
      // console.log(allEvents);
      if (allEvents.length == 0) {
        $("#events").append("No events in history");
      } else {
        for (i = 0; i < allEvents.length; i++) {
          let id = allEvents[i]["_id"];
          $("#events").append(
            `
            <div class="event" id="${id}"> 
              ${allEvents[i].text}
              <span class="event-time">@ ${allEvents[i].time}<span>
              <span class="event-hit-counter">${allEvents[i].hits}<span>
              <button class="like-button" onclick="likeEvent('${id}')">👍</button>
              <button class="delete-button" onclick=deleteEvent('${id}')>❌</button>
            </div>
            `
          );
        }
      }
    },
  });
}

var time = new Date();

function profileViewed(pokemonName) {
  $.ajax({
    url: `/timeline/insert`,
    type: "POST",
    data: {
      text: `${pokemonName} profile viewed`,
      time: time.toLocaleTimeString(),
    },
    success: (data) => {
      loadEvents();
    },
  });
}

function likeEvent(id) {
  $.ajax({
    url: `/timeline/like/${id}`,
    type: "GET",
    success: () => {
      loadEvents();
    },
  });
}
function deleteEvent(id) {
  $.ajax({
    url: `/timeline/remove/${id}`,
    type: "GET",
    success: () => {
      // $(`#${id}`).remove();
      loadEvents();
    },
  });
}
function clearEvents() {
  $.ajax({
    url: `/timeline/removeAll`,
    type: "GET",
    success: () => {
      loadEvents();
    },
  });
}
function setup() {
  loadEvents();
}
$(document).ready(setup);

/* AJAX TEMPLATE
$.ajax({
  url: ``,
  type: "",
  success: () => {},
});
*/
