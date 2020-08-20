// File that contains functions that involve navigation bar

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
