// File that checks if login was successful or not for Login page
// Shows error message if login did not work

function checkStatus() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var status = JSON.parse(this.responseText);
      var flag = status.flag;
      // Check if there is a problem with username and password so error message should be displayed
      if (flag == 0) {
        // Show login error message
        $("div#errorMessages")
          .append(`<div id="loginErrorMessage" class="alert alert-danger alert-dismissible">
            Invalid credentials. Please try again!
            <button
             type="button"
             class="close"
             data-dismiss="alert"
             aria-label="Close"
            >
             <span aria-hidden="true">&times;</span>
            </button>
         </div>`);
      }
    }
  };
  xhr.open("GET", "/users/loginStatus", true);
  xhr.send();
}
