// File that contains functionality to update the navigation bar by the type of user
// and create error and success messages

// Return the HTML for a success message with the specified category and message
function createSuccessMessage(category, message) {
  return `<div class="${category} alert alert-success alert-dismissible">
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
}

// Return the HTML for an error message with the specified category and message
function createErrorMessage(category, message) {
  return `<div class="${category} alert alert-danger alert-dismissible">
  ${message}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  </div>`;
}

// Show the right navigation bar selections based on type of user
function updateNavBarByUserType() {
  // Determine if user is admin or student using AJAX
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var user = JSON.parse(this.responseText);
      var isAdmin = user.isAdmin;
      // Change the navigation bar based on if the user is admin or not
      if (isAdmin) {
        $("#nav-schedule").css({ display: "none" });
        $("#nav-build-schedule").css({ display: "none" });
      } else {
        $("#nav-admin").css({ display: "none" });
        $("#nav-change-courses").css({ display: "none" });
      }
    }
  };
  xhr.open("GET", "/users/isAdmin", true);
  xhr.send();
}

window.addEventListener("load", updateNavBarByUserType);
