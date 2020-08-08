// This file contains functions to retrieve and show semesters for the semester dropdown
// and functions used when an option is selected in the dropdown

// Find the corresponding offerings to the option selected in the dropdown
function onSelect(dropdown, offeringType, tables, editOptions) {
  var semesterSelected = dropdown.options[dropdown.selectedIndex].value;
  if (semesterSelected !== -1) {
    // Get rid of offerings displayed
    removeOfferingsAlreadyShown();
    $("option#defaultOption").css("display", "none"); // TODO - Look at if this is needed
    // Find the offerings to show
    if (offeringType.isUserOffering) {
      retrieveOfferingsForSemesterAndUser(
        semesterSelected,
        tables,
        editOptions.userOffering
      );
    }
    if (offeringType.isSemesterOffering) {
      retrieveOfferingsForSemester(
        semesterSelected,
        tables,
        editOptions.semesterOffering
      );
    }
  }
}

// Function so that offerings previously selected are no longer shown
function removeOfferingsAlreadyShown() {
  $("#offeringTable tbody tr").remove();
}

// Get semesters to display in dropdown at the beginning
function retrieveSemesters() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object
      var semesters = JSON.parse(xhr.responseText);
      var dropdownIds = ['semesterDropdown'];
      processSemesterInfo(semesters, dropdownIds);
    }
  };
  xhr.open("GET", "getSemesters", true);
  xhr.send();
}

// Used to get semesters to put in dropdown for specific user
function retrieveSemestersForUser() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object
      var semesters = JSON.parse(xhr.responseText);
      var dropdownIds= ['semesterDropdown'];
      processSemesterInfo(semesters, dropdownIds);
    }
  };
  xhr.open("GET", "getStudentSemesters", true);
  xhr.send();
}

// Get recent semesters that can be added to or deleted from student's schedule for Build Schedule page
function retrieveRecentSemesters() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create semesters object and create dropdown from it
      var semesters = JSON.parse(xhr.responseText);
      var dropdownIds = ['semesterDropdown', 'semesterOfferingDropdown'];
      processSemesterInfo(semesters, dropdownIds);
    }
  };
  xhr.open("GET", "getRecentSemesters", true);
  xhr.send();
}

// Process semester information retrieved to create dropdown
function processSemesterInfo(semesters, dropdownIds) {
  if (semesters.length > 0) {
    // Go through each semester in semesters    
    var i;
    var semester;
    for (i = 0; i < semesters.length; i++) {
      semester = semesters[i];
      // Add semesters to each dropdown in list
      dropdownIds.forEach(function(dropdownId) {
        addToSemesterDropdown(semester, dropdownId);
      });
    }
  }
}

// Used to get the semesters to show in dropdown
function addToSemesterDropdown(semester, dropdownId) {
  var dropdown = $(`#${dropdownId}`);
  var semesterOutput = `<option value='${semester.semesterId}'>`;
  semesterOutput += `${semester.season} ${semester.year}`;
  semesterOutput += "</option>";

  // Add the semester to the dropdown
  dropdown.append(semesterOutput);
}
