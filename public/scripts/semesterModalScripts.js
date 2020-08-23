// File that contains functions for adding, editing, and deleting semester in modal on Course Maintenance page

$(document).ready(function () {
  // Modal is originally invisible
  $("#addEditSemesterModal").css("display", "none");

  // When semester type dropdown is changed in modal, update the display
  $("#recentDropdown .dropdown-item").on("click", function () {
    $("#recentDropdown button").html(
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
  });

  // Use AJAX to submit semester form
  $("#addEditSemesterForm").submit(function (e) {
    // Override the default
    e.preventDefault();
    // Get form info
    var form = $(this);
    var action = form.attr("action");
    // Don't show modal anymore
    $("#addEditSemesterModal").css({ display: "none" });

    // Submit form information
    $.ajax({
      type: "POST",
      url: action,
      data: form.serialize(),
      success: function (data) {
        if (data.isSemesterAdded) {
          // Show course added success message
          $("div#semesterMessages")
            .append(createSuccessMessage("addingSemesterSuccessMessage", "Semester successfully added!"));
        } else if (data.isSemesterEdited) {
          // Show course edited success message
          $("div#semesterMessages")
            .append(createSuccessMessage("editingSemesterSuccessMessage", "Semester successfully edited!"));
        }
        // Get the semester entries again
        $("#semesterTable tbody tr").remove();
        retrieveSemestersForTable();
        $("#filterModifyCourseOptions, #filterModifySemesterOptions").val("");
      },
    });
  });

  // Function for deleting semester and row in table
  $(document).on("click", ".deleteSemester", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    semesterId = rowId.replace("row", "");
    $.ajax({
      url: "/semesters/deleteSemester",
      type: "POST",
      data: { id: semesterId },
      dataType: "json",
    }).done(function (data) {
      if (!data.isSemesterDeleted) {
        // Show error message; cannot delete semester if there is already corresponding offering
        $("div#semesterMessages")
          .append(createErrorMessage("deletingSemesterErrorMessage", "Error: Cannot delete semester that already has corresponding course offering"));
      } else {
        // Show success message
        $("div#semesterMessages")
          .append(createSuccessMessage("deletingSemesterSuccessMessage", "Semester successfully deleted!"));
        // Get the semester entries again
        $("#semesterTable tbody tr").remove();
        retrieveSemestersForTable();
        $("#filterModifyCourseOptions, #filterModifySemesterOptions").val("");
      }
    });
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
    $("#addEditSemesterForm").attr("action", "/semesters/editSemester");
  });

  // Have current values be placeholders for edit semester modal
  populateEditSemesterModal = (id) => {
    $("form#addEditSemesterForm input#semesterId").val(id);
    $("form#addEditSemesterForm input#season").val($(`#season${id}`).html());
    $("form#addEditSemesterForm input#year").val($(`#year${id}`).html());
    // Set dropdown and hidden input for type of semester (recent or not) so it has original value for semester selected
    if ($(`#isRecent${id}`).html() == "true") {
      $("#recentDropdown button").html(
       'Registration Changes Allowed <span class="caret"></span>'
      );
      $("input#recentType").val("true");
    } else {
      $("#recentDropdown button").html(
        'Semester Set <span class="caret"></span>'
       );
       $("input#recentType").val("false");
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
    $("#addEditSemesterForm").attr("action", "/semesters/addSemester");
  });

  // Cancelling semester modal makes it invisible
  $(".addEditSemesterCancel").click(function () {
    $("#addEditSemesterModal").css("display", "none");
  });
});
