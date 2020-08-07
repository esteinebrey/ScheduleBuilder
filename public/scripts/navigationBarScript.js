// Show the right navigation bar selections based on type of user
function updateNavBarByUserType() {
  // Determine if user is admin or student using AJAX
  console.log("update nav bar");
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var obj = JSON.parse(this.responseText);
      var isAdmin = obj.isAdmin;

      // Change the navigation bar based on if the user is admin or not
      if (isAdmin) {
        console.log("is admin user");
        $("#nav-schedule").css({ display: "none" });
        $("#nav-build-schedule").css({ display: "none" });
      } else {
        console.log("not admin user");
        $("#nav-admin").css({ display: "none" });
        $("#nav-change-courses").css({ display: "none" });
      }
    }
  };
  xhr.open("GET", "getIsAdmin", true);
  xhr.send();
}

window.addEventListener("load", updateNavBarByUserType);
