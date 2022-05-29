function loadUsers() {
  $("#user-list").empty();
  $.ajax({
    url: "/getAllUsers",
    type: "get",
    success: (data) => {
      const { currentUser, userList } = data;
      if (userList.length) {
        for (i = 0; i < userList.length; i++) {
          let isAdmin = userList[i].admin ? "isAdmin" : "";
          parity = i % 2 ? "odd" : "even";
          let id = userList[i]["_id"];
          $("#user-list").append(
            `
            <div class="user ${isAdmin} row-${parity}" id="${id}"> 
              <p class="username">${userList[i].username}</p>
              <p class="username">${userList[i].email}</p>
              <p class="username">${userList[i].added}</p>
              <button class="edit-user" onclick="editUser('${id}')">✏️</button>
              <button class="delete-user"  onclick="deleteUser('${id}')">🗑</button>
            </div>
            `
          );
          if (userList[i].username == currentUser) {
            $(`#${id} .edit-user`).prop("disabled", true);
            $(`#${id} .delete-user`).prop("disabled", true);
          }
        }
      } else {
        $("#user-list").append(`<p class="empty-message">No users<p>`);
      }
    },
  });
}
function editUser(id) {
  if ($(`#${id}`).hasClass("selected-row")) {
    $(`#${id}`).removeClass("selected-row");
    $("#add-user").prop("checked", true);
    $("#update-user").prop("disabled", true);
  } else {
    $.ajax({
      url: `/getUser/${id}`,
      type: "GET",
      success: (user) => {
        $("#username").val(user.username);
        $("#email").val(user.email);
        $("#password").val(user.password);
        $(".user").removeClass("selected-row");
        $(`#${id}`).addClass("selected-row");
        $("#update-user").prop("disabled", false);
        $("#update-user").prop("checked", true);
      },
    });
  }
}

function deleteUser(id) {
  $.ajax({
    url: `/deleteUser/${id}`,
    type: "GET",
    success: (data) => {
      if (data.deletedCount) $(`#${id}`).remove();
    },
  });
}
function setup() {
  loadUsers();
}
$(document).ready(setup);
