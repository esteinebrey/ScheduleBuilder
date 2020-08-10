// This file contains functions to retrieve and show semesters for the semester dropdown,
// functions used when an option is selected in the dropdown,
// and functions used for semester table in Change Courses page

// Find the corresponding offerings to the option selected in the dropdown
function onSelect(dropdown, offeringType, tables, editOptions) {
  var semesterSelected = dropdown.options[dropdown.selectedIndex].value;
  if (semesterSelected !== -1) {
    // Get rid of offerings displayed
    removeOfferingsAlreadyShown();
    $("option#defaultOption").css("display", "none"); 
    // Retrieve the offerings
    // Get offerings that student is taking
    if (offeringType.isUserOffering) {
      retrieveOfferingsForSemesterAndUser(
        semesterSelected,
        tables,
        editOptions.userOffering,
        offeringType
      );
    }
    // Get the available offerings
    if (offeringType.isSemesterOffering) {
      retrieveOfferingsForSemester(
        semesterSelected,
        tables,
        editOptions.semesterOffering,
        offeringType
      );
    }
  }
}

// Function so that offerings previously selected are no longer shown
function removeOfferingsAlreadyShown() {
  $("#offeringTable tbody tr").remove();
}

// Get all semesters to display in dropdown at the beginning
function retrieveSemesters() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object for semesters and process it
      var semesters = JSON.parse(xhr.responseText);
      var dropdownIds = ["semesterDropdown"];
      processSemesterInfo(semesters, dropdownIds);
    }
  };
  xhr.open("GET", "getSemesters", true);
  xhr.send();
}

// Used to get semesters to put in dropdown for specific user
// Only shows the semesters where a student takes a course
function retrieveSemestersForUser() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object for semesters and process it
      var semesters = JSON.parse(xhr.responseText);
      var dropdownIds = ["semesterDropdown"];
      processSemesterInfo(semesters, dropdownIds);
    }
  };
  xhr.open("GET", "getStudentSemesters", true);
  xhr.send();
}

// Get recent semesters
// Corresponding courses to these semesters can be added to or deleted from student's schedule for Build Schedule page
function retrieveRecentSemesters() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create semesters object and create dropdown from it
      var semesters = JSON.parse(xhr.responseText);
      var dropdownIds = ["semesterDropdown", "semesterOfferingDropdown"];
      processSemesterInfo(semesters, dropdownIds);
    }
  };
  xhr.open("GET", "getRecentSemesters", true);
  xhr.send();
}

// Process semester information retrieved for dropdowns corresponding to dropdownIds
function processSemesterInfo(semesters, dropdownIds) {
  if (semesters.length > 0) {
    // Go through each semester in semesters
    var i;
    var semester;
    for (i = 0; i < semesters.length; i++) {
      semester = semesters[i];
      // Add semesters to each dropdown in list
      dropdownIds.forEach(function (dropdownId) {
        addToSemesterDropdown(semester, dropdownId);
      });
    }
  }
}

// Function to get the semesters to show in dropdown
function addToSemesterDropdown(semester, dropdownId) {
  var dropdown = $(`#${dropdownId}`);
  var semesterOutput = `<option value='${semester.semesterId}'>`;
  semesterOutput += `${semester.season} ${semester.year}`;
  semesterOutput += "</option>";

  // Add the semester to the dropdown
  dropdown.append(semesterOutput);
}

// Functions to get semesters to put in table for Admin Page
function retrieveSemestersForTable() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object for semesters
      var semesters = JSON.parse(xhr.responseText);
      if (semesters.length > 0) {
        // Access the table
        var semesterTable = $("#semesterTable");
        var i;
        var semester;
        // Create a row in the semester table for each semester
        for (i = 0; i < semesters.length; i++) {
          semester = semesters[i];
          createSemesterRow(semester, semesterTable);
        }
      }
    }
  };
  xhr.open("GET", "getSemesters", true);
  xhr.send();
}

// Add semester info to specified table
function createSemesterRow(semester, table) {
  // Create semester row
  var isRecent = semester.isRecent == 0 ? "false" : "true";
  var semesterOutput = `<tr id='row${semester.semesterId}'>`;
  semesterOutput += `<td id='season${semester.semesterId}'>${semester.season}</td>`;
  semesterOutput += `<td id='year${semester.semesterId}'>${semester.year}</td>`;
  semesterOutput += `<td id='isRecent${semester.semesterId}'>${isRecent}</td>`;
  semesterOutput +=
    "<td> <span class='editSemester glyphicon glyphicon-pencil'></span> <span class='deleteSemester glyphicon glyphicon-trash'></span> </td>";
  semesterOutput += "</tr>";

  // Add the row to the table
  table.append(semesterOutput);
}
