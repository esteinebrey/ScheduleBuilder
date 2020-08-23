// File that checks if login was successful or not for Login page
// Shows error message if login did not work

// Check login status
function checkStatus() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var status = JSON.parse(this.responseText);
      var flag = status.flag;
      // Check if there is a problem with username and password so error message should be displayed
      if (flag == 0) {
        // Show login error message
        console.log(createErrorMessage("loginErrorMessage", "Invalid credentials. Please try again!"));
        $("div#errorMessages")
          .append(createErrorMessage("loginErrorMessage", "Invalid credentials. Please try again!"));
      }
    }
  };
  xhr.open("GET", "/users/loginStatus", true);
  xhr.send();
}
