function loadUsers() {
  $("#user-list").empty();
  $.ajax({
    url: "/getAllUsers",
    type: "get",
    success: (userList) => {
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
              <button class="edit-user" onclick="editUser('${id}')">✏️</button>
              <button class="delete-user"  onclick="deleteUser('${id}')">🗑</button>
            </div>
            `
          );
          if (userList[i].admin) {
            $(`#${id} .delete-user`).prop("disabled", true);
          }
        }
      }
    },
  });
}
function editUser(id) {
  $.ajax({
    url: `/getUser/${id}`,
    type: "GET",
    success: (user) => {
      console.log(user);
      $("#username").val(user.username);
      $("#email").val(user.email);
      $("#password").val(user.password);
      $("#update-user-form").attr("action", `/updateUser/${id}`);
    },
  });
}

function deleteUser(id) {
  $.ajax({
    url: `/deleteUser/${id}`,
    type: "GET",
    success: () => {
      $(`#${id}`).remove();
    },
  });
}
function setup() {
  loadUsers();
}
$(document).ready(setup);
