// File that has functions to display courses, switch between course and offering tables, and
// allow for courses to be selected in dropdown

// Initially, don't show course table
var isCourseTableShown = false;

// When choose an option in the dropdown, show the corresponding table
function showCorrectTable(dropdown) {
  var semesterSelected = dropdown.options[dropdown.selectedIndex].value;
  // If select to view courses and course table isn't shown, change the table visibility
  if (semesterSelected == "courses" && !isCourseTableShown) {
    determineTableShown();
  }
  // If the course table is shown but want to show offerings, change the table visibility
  else if (isCourseTableShown) {
    determineTableShown();
  }
}

// Determine if course or offering table should be displayed
// Used to display the right table for pages that show both offerings and courses
function determineTableShown() {
  isCourseTableShown = !isCourseTableShown;
  var offeringDisplay = isCourseTableShown ? "none" : "table";
  var courseDisplay = isCourseTableShown ? "table" : "none";
  $("#offeringTable").css("display", offeringDisplay);
  $("#courseTable").css("display", courseDisplay);
}

// Set up the dropdown so that it has an option to show All Courses
function setUpDropdown() {
  var dropdown = $("#semesterDropdown");
  dropdown.append(
    '<option value="courses" selected>' + "All Courses" + "</option>"
  );
}

// Get all the courses to display
function retrieveCourses(courseOptions) {
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
          createRow(course, table, courseOptions);
        }
      }
    }
  };
  xhr.open("GET", "getAllCourses", true);
  xhr.send();
}

// Create a row for the specified course and add it to the table
function createRow(course, table, courseOptions) {
  var courseOutput = `<tr id='row${course.courseId}'>`;
  courseOutput += `<td id='name${course.courseId}'>${course.name}</td>`;
  if (courseOptions.edit) {
    courseOutput += `<td id='deptCode${course.courseId}'>${course.deptCode}</td>`;
    courseOutput += `<td id='number${course.courseId}'>${course.courseNumber}</td>`;
  } else {
    courseOutput += `<td id='code${course.courseId}'>${course.deptCode} ${course.courseNumber}</td>`;
  }
  courseOutput += `<td id='credits${course.courseId}'>${course.credits}</td>`;
  courseOutput += `<td id='desc${course.courseId}'>${course.description}</td>`;
  if (courseOptions.edit && courseOptions.delete) {
    courseOutput +=
      "<td><span class='addOffering glyphicon glyphicon-plus'></span><span class='editCourse glyphicon glyphicon-pencil'></span> <span class='deleteCourse glyphicon glyphicon-trash'></span> </td>";
  }
  courseOutput += "</tr>";

  // Add the row to the table
  table.append(courseOutput);
}
