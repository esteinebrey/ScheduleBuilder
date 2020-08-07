var isCourseTableShown = false;

function determineTableShown() {
  isCourseTableShown = !isCourseTableShown;
  var offeringDisplay = isCourseTableShown ? "none" : "table";
  var courseDisplay = isCourseTableShown ? "table" : "none";
  $("#offeringTable").css("display", offeringDisplay);
  $("#courseTable").css("display", courseDisplay);
}

function setUpDropdown() {
  var dropdown = $("#semesterDropdown");
  dropdown.append('<option value="-1" selected>' + "All Courses" + "</option>");
}

function showCorrectTable(obj) {
  // console.log(obj.selectedIndex);
  // var dropdown = $("#semesterDropdown");
  // console.log(obj.options[obj.selectedIndex]);
  var semesterSelected = obj.options[obj.selectedIndex].value;
  if (semesterSelected == -1 && !isCourseTableShown) {
    determineTableShown();
  } else if (isCourseTableShown) {
    determineTableShown();
  }
}

function retrieveCourses() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object
      var obj = JSON.parse(xhr.responseText);
      if (obj.length > 0) {
        // Access the table
        var table = $("#courseTable");
        var i;
        var courseInfo;
        for (i = 0; i < obj.length; i++) {
          courseInfo = obj[i];
          console.log(courseInfo);
          // For each contact, create a row and add it to the table
          createRow(courseInfo, table);
        }
      }
    }
  };
  xhr.open("GET", "getAllCourses", true);
  xhr.send();
}

// Add the contact info to the table as a row
function createRow(courseInfo, table) {
  // Create the row and make each cell of the row
  var courseOutput = "<tr class='courseRow'>";
  courseOutput += "<td>" + courseInfo.name + "</td>";
  courseOutput +=
    "<td>" + courseInfo.deptCode + " " + courseInfo.courseNumber + "</td>";
  courseOutput += "<td>" + courseInfo.credits + "</td>";
  courseOutput += "<td>" + courseInfo.description + "</td>";
  courseOutput += "</tr>";

  // Add the row to the table
  table.append(courseOutput);
}
