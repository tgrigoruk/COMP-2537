function loadUsers() {
  $("#user-list").empty();
  $.ajax({
    url: "/getAllUsers",
    type: "get",
    success: (userList) => {
      console.log(userList);
      if (userList.length == 0) {
        $("#user-list").append(`<p id="no-users">No users<p>`);
      } else {
        for (i = 0; i < userList.length; i++) {
          parity = i % 2 ? "odd" : "even";
          let id = userList[i]["_id"];
          $("#user-list").append(
            `
            <div class="user row-${parity}" id="${id}"> 
              <span class="username">${userList[i].username}</span>
              <span class="username">${userList[i].email}</span>
              <span class="username">${userList[i].added}</span>
              <button class="edit-button" onclick="">edit</button>
              <button class="delete-button"  onclick="">delete</button>
            </div>
            `
          );
        }
      }
    },
  });
}

function setup() {
  loadUsers();
}
$(document).ready(setup);
