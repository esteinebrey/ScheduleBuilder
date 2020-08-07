$(document).ready(function () {
  // modal is orginally invisible
  $("#addEditSemesterModal").css("display", "none");

  // function for deleting semester row
  $(document).on("click", ".deleteSemester", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    semesterId = rowId.replace("row", "");
    $.ajax({
      url: "/deleteSemester",
      type: "POST",
      data: { id: semesterId },
      dataType: "json",
    });
    location.reload();
  });

  // function for editing semester row
  $(document).on("click", ".editSemester", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    id = rowId.replace("row", "");
    $("#addEditSemesterModal").css("display", "block");
    $("form#addEditSemesterForm input#semesterId").val(id);
    $("form#addEditSemesterForm input#season").val($(`#season${id}`).html());
    $("form#addEditSemesterForm input#year").val($(`#year${id}`).html());
    if ($(`#isRecent${id}`).html() == "true") {
      $("form#addEditSemesterForm select#recentType option[value='true']").attr(
        "selected",
        true
      );
    } else {
      $(
        "form#addEditSemesterForm select#recentType option[value='false']"
      ).attr("selected", true);
    }
    $("h1#addEditSemesterTitle").html("Edit Semester");
    $("#addEditSemesterButton").val("Update Semester");
    $("#addEditSemesterForm").attr("action", "/editSemester");
  });

  // function for adding semester
  $(document).on("click", "#addSemesterButton", function () {
    $("#addEditSemesterModal").css("display", "block");
    $("form#addEditSemesterForm input#season").val("");
    $("form#addEditSemesterForm input#year").val("");
    $("h1#addEditSemesterTitle").html("Add Semester");
    $("#addEditSemesterButton").val("Add Semester");
    $("#addEditSemesterForm").attr("action", "/addSemester");
  });

  // cancelling modal makes it invisible
  $(".addEditSemesterCancel").click(function () {
    $("#addEditSemesterModal").css("display", "none");
  });
});

// Used to get semesters to put in dropdown
function retrieveSemesters() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object
      var semesterObj = JSON.parse(xhr.responseText);
      if (semesterObj.length > 0) {
        // Access the table
        var semesterTable = $("#semesterTable");
        var i;
        var semesterInfo;
        for (i = 0; i < semesterObj.length; i++) {
          semesterInfo = semesterObj[i];
          // For each contact, create a row and add it to the table
          createSemesterRow(semesterInfo, semesterTable);
        }
      }
    }
  };
  xhr.open("GET", "getSemesters", true);
  xhr.send();
}

// Add row to semester table
function createSemesterRow(semesterInfo, table) {
  // Create the row and make each cell of the row
  var isRecent = semesterInfo.isRecent == 0 ? "false" : "true";
  var semesterOutput = `<tr id='row${semesterInfo.semesterId}'>`;
  semesterOutput += `<td id='season${semesterInfo.semesterId}'>${semesterInfo.season}</td>`;
  semesterOutput += `<td id='year${semesterInfo.semesterId}'>${semesterInfo.year}</td>`;
  semesterOutput += `<td id='isRecent${semesterInfo.semesterId}'>${isRecent}</td>`;
  semesterOutput +=
    "<td> <span class='editSemester glyphicon glyphicon-pencil'></span> <span class='deleteSemester glyphicon glyphicon-trash'></span> </td>";
  semesterOutput += "</tr>";

  // Add the row to the table
  table.append(semesterOutput);
}

// Used to get semesters to put in dropdown for specific user
function retrieveRecentSemesters() {
  // Create XMLHttpRequest
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create JSON object
      var semesterObj = JSON.parse(xhr.responseText);
      processSemesterInfo(semesterObj);
    }
  };
  xhr.open("GET", "getRecentSemesters", true);
  xhr.send();
}

function processSemesterInfo(semesterObj) {
  if (semesterObj.length > 0) {
    // Access the table
    var dropdown = $("#semesterDropdown");
    var formDropdown = $("#semesterOfferingDropdown");
    var i;
    var semesterInfo;
    for (i = 0; i < semesterObj.length; i++) {
      semesterInfo = semesterObj[i];
      // For each contact, create a row and add it to the table
      addToSemesterDropdown(semesterInfo, dropdown);
      addToSemesterDropdown(semesterInfo, formDropdown);
    }
  }
}

// Used to get the semesters to show in dropdown
function addToSemesterDropdown(semesterInfo, dropdown) {
  var semesterOutput = "<option value='" + semesterInfo.semesterId + "'>";
  semesterOutput += semesterInfo.season + " " + semesterInfo.year;
  semesterOutput += "</option>";

  // Add the row to the table
  dropdown.append(semesterOutput);
}
