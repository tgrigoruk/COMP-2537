const time = new Date();
function logEvent(text) {
  $.ajax({
    url: `/timeline/insert`,
    type: "POST",
    data: {
      text: text,
      time: time.toLocaleTimeString(),
    },
    success: () => {
      // console.log(`Added to timeline: ${text}`);
    },
  });
}
