// File that contains functions for semester modal on Course Maintenance page

$(document).ready(function () {
  // Modal is originally invisible
  $("#addEditSemesterModal").css("display", "none");

  // When semester type dropdown is changed in modal, update the display
  $("#modalTypeDropdown .dropdown-item").on("click", function () {
    $("#modalTypeDropdown button").html(
      $(this).text() + ' <span class="caret"></span>'
    );

    // Set if semester is recent or not in hidden input box
    var value;
    if ($(this).text() === "Semester Set") {
      value = "false";
    }
    else {
      value = "true";
    }
    // Set hidden input for type of semester (recent or not) so can access on form submit
    $("input#recentType").val(value);

    console.log("now");
    console.log($("input#recentType").val());
  });

  // Function for deleting semester and row in table
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

  // Function for editing semester and corresponding row
  $(document).on("click", ".editSemester", function () {
    // Show semester modal
    $("#addEditSemesterModal").css("display", "block");
    // Get ID of semester to edit
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    id = rowId.replace("row", "");
    populateEditSemesterModal(id);
    // Change semester modal, so it is for edit and not add
    $("h1#addEditSemesterTitle").html("Edit Semester");
    $("#addEditSemesterButton").val("Update Semester");
    $("#addEditSemesterForm").attr("action", "/editSemester");
  });

  // Have current values be placeholders for edit semester modal
  populateEditSemesterModal = (id) => {
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
  };

  // Function for adding semester
  $(document).on("click", "#addSemesterButton", function () {
    // Show modal
    $("#addEditSemesterModal").css("display", "block");
    // Do not show placeholder values
    $("form#addEditSemesterForm input#season").val("");
    $("form#addEditSemesterForm input#year").val("");
    // Change semester modal, so it is for add and not edit
    $("h1#addEditSemesterTitle").html("Add Semester");
    $("#addEditSemesterButton").val("Add Semester");
    $("#addEditSemesterForm").attr("action", "/addSemester");
  });

  // Cancelling semester modal makes it invisible
  $(".addEditSemesterCancel").click(function () {
    $("#addEditSemesterModal").css("display", "none");
  });
});
