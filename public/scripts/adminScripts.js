// File containing the scripts for the Admin Page
// Contains the functions for getting user information and using the Admin page modals

// Admin Modal Scripts
$(document).ready(function () {
  // Modal and error messages are originally invisible
  $("#addEditModal").css({ display: "none" });

  // Use AJAX to submit form in the modal
  $("#addEditForm").submit(function (e) {
    // Override the default
    e.preventDefault();
    // Get form info
    var form = $(this);
    var action = form.attr("action");
    // Don't show modal anymore
    $("#addEditModal").css({ display: "none" });

    // Submit form information
    $.ajax({
      type: "POST",
      url: action,
      data: form.serialize(),
      success: function (data) {
        if (data.isUserAdded) {
          // Show successful insertion message
          $("div#messages")
            .append(createSuccessMessage("addingUserSuccessMessage", "User successfully added!"));
        } else if (data.isUserEdited) {
          // Show successful update message
          $("div#messages")
            .append(createSuccessMessage("editingUserSuccessMessage", "User successfully edited!"));
        } else {
          // There is an error
          // Show message that username is already taken
          $("div#messages")
            .append(createErrorMessage("usernameTakenErrorMessage", "Error: Username must be unique"));
        }
        // Get the entries again
        $("#adminTable tbody").empty();
        retrieveUsers();
      }
    });
  });

  // Show the dropdown option clicked for type of user in modal
  $("#userTypeDropdown .dropdown-item").on("click", function () {
    $("#userTypeDropdown button").html(
      $(this).text() + ' <span class="caret"></span>'
    );
    // Set hidden input for user type so can access on form submit
    $("input#userType").val($(this).text().toLowerCase());
  });

  // Function for deleting user from Schedule Builder
  $(document).on("click", ".delete", function () {
    // Get the ID of the user to delete; row will be removed from screen
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    userId = rowId.replace("row", "");
    // Delete the user using AJAX
    var request = $.ajax({
      url: "/users/deleteUser",
      type: "POST",
      data: { id: userId },
      dataType: "json",
    }).done(function (data) {
      if (data.deletionError == "currentUser") {
        // Show message that cannot delete current user
        $("div#messages")
          .append(createErrorMessage("deletingCurrentUserErrorMessage", "Error: Cannot delete current user"));
      } else if (data.deletionError == "registeredUser") {
        // Show message that cannot delete a user who has already registered for classes
        $("div#messages")
          .append(createErrorMessage("deletingRegisteredUserErrorMessage", "Error: Cannot delete a user that has already registered for classes"));
      } else {
        // Show successful deletion message
        $("div#messages")
          .append(createSuccessMessage("deletingUserSuccessMessage", "User deleted successfully!"));
        // Get the entries again
        // There is no error
        $("#adminTable tbody").empty();
        retrieveUsers();
      }
    });
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
    $("form#addEditForm input#password").val("");
    // Take 'true' or 'false' to indicate if user is admin and form dropdown on modal
    if ($(`#isAdmin${id}`).html() == "true") {
      $("#userTypeDropdown button").html('Admin <span class="caret"></span>');
      // Set hidden input for user type so can access on form submit
      $("input#userType").val("admin");
    } else {
      $("#userTypeDropdown button").html(
        'Student <span class="caret"></span>'
      );
      // Set hidden input for user type so can access on form submit
      $("input#userType").val("student");
    }
  };

  // Show edit modal info
  showEditModal = () => {
    $("h1#addEditFormTitle").html("Edit User");
    $("#addEditButton").val("Update User");

    $("#addEditForm").attr("action", "/users/editUser");
    $("form#addEditForm input#password").prop("required", false);
  };

  // Function for adding user to Schedule Builder
  $(document).on("click", "#addButton", function () {
    // Show the modal
    $("#addEditModal").css("display", "block");
    // Pre-populate form with blank values
    $("form#addEditForm input#name").val("");
    $("form#addEditForm input#login").val("");
    $("form#addEditForm input#password").val("");
    // Set up dropdown pre-selected option as student
    $("#userTypeDropdown button").html('Student <span class="caret"></span>');
    $("input#userType").val("student");
    showAddModal();
  });

  // Update the add/edit modal so it is for add
  showAddModal = () => {
    $("h1#addEditFormTitle").html("Add User");
    $("#addEditButton").val("Add User");
    $("#addEditForm").attr("action", "/users/addUser");
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
  xhr.open("GET", "/users", true);
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
