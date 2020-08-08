// Initially, don't show course table
var isCourseTableShown = false;

// Used to display the right table for pages that show both offerings and courses
function determineTableShown() {
  isCourseTableShown = !isCourseTableShown;
  var offeringDisplay = isCourseTableShown ? "none" : "table";
  var courseDisplay = isCourseTableShown ? "table" : "none";
  $("#offeringTable").css("display", offeringDisplay);
  $("#courseTable").css("display", courseDisplay);
}

// Set up the dropdown so that it has an option to get all courses
function setUpDropdown() {
  var dropdown = $("#semesterDropdown");
  dropdown.append('<option value="courses" selected>' + "All Courses" + "</option>"); 
}

// When choose an option in the dropdown, show the corresponding table
function showCorrectTable(dropdown) {
  var semesterSelected = dropdown.options[dropdown.selectedIndex].value;
  // If select to view courses and course table isn't shown, change the table visibility
  if (semesterSelected == 'courses' && !isCourseTableShown) {
    determineTableShown();
  } 
  // If the course table is shown but want to show offerings, change the table visibility
  else if (isCourseTableShown) {
    determineTableShown();
  }
}

// Get all the courses to display
function retrieveCourses() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object for the courses
      var courses = JSON.parse(xhr.responseText);
      if (courses.length > 0) {
        // Access the table
        var table = $("#courseTable");
        var i;
        var course;
        // Create a row for each course
        for (i = 0; i < courses.length; i++) {
          course = courses[i];
          createRow(course, table);
        }
      }
    }
  };
  xhr.open("GET", "getAllCourses", true);
  xhr.send();
}

// Create a row for the specified course and add it to the table
function createRow(course, table) {
  var courseOutput = "<tr class='courseRow'>";
  courseOutput += `<td>${course.name}</td>`;
  courseOutput +=
    `<td>${course.deptCode} ${course.courseNumber}</td>`;
  courseOutput += `<td>${course.credits}</td>`;
  courseOutput += `<td>${course.description}</td>`;
  courseOutput += "</tr>";

  // Add the row to the table
  table.append(courseOutput);
}
