// Scripts for course panels

// Add All Courses option to dropdown
function setUpDropdown() {
  var dropdown = $("#viewCoursesSemesterDropdown");
  dropdown.append(
    `<li class="semesterOption dropdownAlignment">
        <a id="allCourses" class="dropdown-item" href="#">All Courses</a>
        </li>`
  );
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
        var section = $("#courses");
        var i;
        var course;
        // Create a panel for each course
        for (i = 0; i < courses.length; i++) {
          course = courses[i];
          createCoursePanel(course, section);
        }
      }
    }
  };
  xhr.open("GET", "getAllCourses", true);
  xhr.send();
}

// Create a panel for the specified course and add it to the section
function createCoursePanel(course, section) {
  var courseOutput = `<div class='panel panel-default course${course.courseId}'>`;
  courseOutput += `<div class="panel-heading panel-heading-blue">${course.deptCode} ${course.courseNumber}: ${course.name}</div>`;
  courseOutput += `<div class="panel-body bg-info"><p>${course.credits} credits</p><p>${course.description}</p></div>`;
  courseOutput += "</div>";

  // Add the row to the table
  section.append(courseOutput);
}
