// This file contains functions to retrieve and show semesters for the semester dropdown,
// functions used when an option is selected in the dropdown,
// and functions used for semester table in Course Maintenance page

$(document).ready(function () {
  // Show the courses for the dropdown option clicked
  // Logic for View Courses page dropdown
  $("#viewCoursesSemesterDropdown").on("click", ".dropdown-item", function (
    event
  ) {
    $("div.dropdown button").html(
      $(this).text() + ' <span class="caret"></span>'
    );
    var offeringType = { isUserOffering: false, isSemesterOffering: true };
    var sections = { availableOfferings: "courses" };
    var editOptions = {
      semesterOffering: {
        delete: false,
        add: false,
        edit: false,
        type: "coursesOffered",
      }
    };
    
    showCourses($(this).attr("id"), offeringType, sections, editOptions);
    $("#filterCourses").val("");
  });

  // Logic for Course Maintenance page dropdown
  $("#courseMaintenanceSemesterDropdown").on("click", ".dropdown-item", function (event) {
    $("div#courseMaintenanceMainDropdown.dropdown button").html(
      $(this).text() + ' <span class="caret"></span>'
    );
    var offeringType = { isUserOffering: false, isSemesterOffering: true };
    var tables = {
      availableOfferingTable: "offeringTable",
    };
    var editOptions = {
      semesterOffering: {
        delete: true,
        add: false,
        edit: true,
        type: "coursesOffered",
      },
    };
    
    $("div#courseMaintenanceMainDropdown button").attr("id", $(this).attr("id"));
    showCorrectTable($(this).attr("id")); 
    onSelect($(this).attr("id"), offeringType, tables, editOptions);
    $("#filterModifyCourseOptions, #filterModifySemesterOptions").val("");
  });

  // Logic for Schedule page dropdown
  $("#viewScheduleSemesterDropdown").on("click", ".dropdown-item", function (event) {
    $("div.dropdown button").html(
      $(this).text() + ' <span class="caret"></span>'
    );
    var offeringType = { isUserOffering: true, isSemesterOffering: false };
    var sections = {
      userOfferings: "schedule",
    };
    var editOptions = {
      userOffering: {
        delete: false,
        add: false,
        edit: false,
        type: "schedule",
      },
    };
    showCourses($(this).attr("id"), offeringType, sections, editOptions);
  });

  // Logic for Build Schedule page dropdown
  $("#buildScheduleSemesterDropdown").on("click", ".dropdown-item", function (event) {
    var buildScheduleSelectedOption = $(this);
    $("div.dropdown button").html(
      buildScheduleSelectedOption.text() + ' <span class="caret"></span>'
    );
    $("#buildScheduleSemesterDropdown").val(
      buildScheduleSelectedOption.attr("id")
    );

    var offeringType = {
      isUserOffering: true,
      isSemesterOffering: false,
      isNotUserOffering: true,
    };
    var sections = {
      userOfferings: "registeredCourses",
      availableOfferings: "possibleCourses",
    };
    var editOptions = {
      semesterOffering: { delete: false, add: true, type: "coursesOffered" },
      userOffering: { delete: true, add: false, type: "studentSchedule" },
    };
    // Show the content once semester chosen
    $("#buildScheduleContent").show();
    showCourses(
      buildScheduleSelectedOption.attr("id"),
      offeringType,
      sections,
      editOptions
    );
    //$('#filterCourses').val("");
  });
});

// Add All Courses option to dropdown
function addCoursesToDropdown(dropdownId) {
  var dropdown = $(dropdownId);
  dropdown.append(
    `<li class="semesterOption dropdownAlignment">
        <a id="allCourses" class="dropdown-item" href="#">All Courses</a>
        </li>`
  );
}

// Get all semesters to display in dropdown at the beginning
function retrieveSemesters() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object for semesters and process it
      var semesters = JSON.parse(xhr.responseText);
      var dropdownIds = ["viewCoursesSemesterDropdown"];
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
      var dropdownIds = ["viewScheduleSemesterDropdown"];
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
      var dropdownIds = ["buildScheduleSemesterDropdown", "courseMaintenanceSemesterDropdown", "semesterOfferingDropdown"];
      processSemesterInfo(semesters, dropdownIds);
    }
  };
  xhr.open("GET", "getRecentSemesters", true);
  xhr.send();
}

// Process semester information retrieved for dropdowns corresponding to dropdownIds
function processSemesterInfo(semesters, dropdownIds) {
  if (semesters.length > 0) {
    // Student has registrations, so show dropdown
    if (dropdownIds.includes("viewScheduleSemesterDropdown")) {
      $("div.dropdown").css({"display": "block"});
      $("#scheduleError").css({"display": "none"});
    }
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
  // If user has not registered for any classes, do not show dropdown for Schedule Page
  else if (dropdownIds.includes("viewScheduleSemesterDropdown")) {
    $("div.dropdown").css({"display": "none"});
    $("#scheduleError").css({"display": "block"});
  }
}

// Function to get the semesters to show in dropdown
function addToSemesterDropdown(semester, dropdownId) {
  var dropdown = $(`#${dropdownId}`);
  var semesterOutput = `<li class="semesterOption dropdownAlignment">`;
  semesterOutput += `<a id="semester${semester.semesterId}" class="dropdown-item" href="#">${semester.season} ${semester.year}</a>`;
  semesterOutput += `</li>`;

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
