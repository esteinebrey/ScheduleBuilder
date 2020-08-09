// File containing the scripts for the Admin Page
// Contains the functions for getting user information and using the modals

// Admin Modal Scripts
$(document).ready(function () {
  // Modal is originally invisible
  $("#addEditModal").css("display", "none");

  // Function for deleting user from Schedule Builder
  $(document).on("click", ".delete", function () {
    // Get the ID of the user to delete; row will be removed from screen
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    userId = rowId.replace("row", "");
    var request = $.ajax({
      url: "/deleteUser",
      type: "POST",
      data: { id: userId },
      dataType: "json",
    });
    location.reload();
  });

  // Function for editing user to Schedule Builder
  $(document).on("click", ".edit", function () {
    // Get the ID of the user to edit; row will be updated
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    id = rowId.replace("row", "");
    // Show the edit modal and pre-populate the values
    $("#addEditModal").css("display", "block");
    populateEditModal(id);
    // Update the add/edit modal so it is for edit
    showEditModal();
  });

  // Populate information from row selected into edit modal
  populateEditModal = (id) => {
    $("form#addEditForm input#userId").val(id);
    $("form#addEditForm input#name").val($(`#name${id}`).html());
    $("form#addEditForm input#login").val($(`#login${id}`).html());
    // Take 'true' or 'false' to indicate if user is admin and form dropdown on modal
    if ($(`#isAdmin${id}`).html() == "true") {
      $("form#addEditForm select#userType option[value='admin']").attr(
        "selected",
        true
      );
    } else {
      $("form#addEditForm select#userType option[value='regular']").attr(
        "selected",
        true
      );
    }
  };

  // Show edit modal info
  showEditModal = () => {
    $("h1#addEditFormTitle").html("Edit User");
    $("#addEditButton").val("Update User");
    $("#addEditForm").attr("action", "/editUser");
    $("form#addEditForm input#password").prop("required", false);
  };

  // Function for adding user to Schedule Builder
  $(document).on("click", "#addButton", function () {
    // Show the modal
    $("#addEditModal").css("display", "block");
    // Pre-populate form with blank values
    $("form#addEditForm input#name").val("");
    $("form#addEditForm input#login").val("");
    // Update the add/edit modal so it is for add
    showAddModal();
  });

  showAddModal = () => {
    $("h1#addEditFormTitle").html("Add User");
    $("#addEditButton").val("Add User");
    $("#addEditForm").attr("action", "/addUser");
    $("form#addEditForm input#password").prop("required", true);
  };

  // Cancelling from modal makes modal invisible
  $(".addEditCancel").click(function () {
    $("#addEditModal").css("display", "none");
  });
});

// Functions for getting user information

// Get the user information to display on page
function retrieveUsers() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object for users and process them
      var users = JSON.parse(xhr.responseText);
      processUserInfo(users);
    }
  };
  xhr.open("GET", "getUsers", true);
  xhr.send();
}

// Function to go through users and add information to table
function processUserInfo(users) {
  if (users.length > 0) {
    // Access the table
    var table = $("#adminTable");
    var i;
    var user;
    // For each user, create a row and add it to the table
    for (i = 0; i < users.length; i++) {
      user = users[i];
      addToUserTable(user, table);
    }
  }
}

// Add specified user to specified table
function addToUserTable(user, table) {
  // Create the row and make each cell of the row
  var isAdministrator = user.isAdmin === 1 ? "true" : "false";
  var userOutput = `<tr class='offeringRow' id='row${user.userId}'>`;
  userOutput += `<td id='name${user.userId}'>${user.name}</td>`;
  userOutput += `<td id='login${user.userId}'>${user.login}</td>`;
  userOutput += `<td id='password${user.userId}'> </td>`;
  userOutput += `<td id='isAdmin${user.userId}'>${isAdministrator}</td>`;
  userOutput +=
    "<td> <span class='edit glyphicon glyphicon-pencil'></span> <span class='delete glyphicon glyphicon-trash'></span> </td>";
  userOutput += "</tr>";

  // Add the row to the table
  table.append(userOutput);
}
