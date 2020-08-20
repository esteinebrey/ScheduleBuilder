// File containing functions for editing, adding, and deleting courses

$(document).ready(function () {
  // Modal is originally invisible
  $("#courseModal").css({ display: "none" });

  // Set up basic information for Course Maintenance page
  var courseOptions = { edit: true, delete: true };

  // Get the recent semesters when pick on Modify Courses tab
  // This will fill out the main dropdown for this tab
  // This way if a course is edited to be recent or not in other tab, it can immediately appear
  $("#coursesTab").on("click", function () {
    // Get rid of existing options
    $("#courseMaintenanceSemesterDropdown li").empty();
    retrieveRecentSemesters();
    // Put All Courses option in dropdown
    addCoursesToDropdown("#courseMaintenanceSemesterDropdown");
    // ID should match All Courses option
    $("div#courseMaintenanceMainDropdown button").attr("id", "allCourses");
  });

  // When semester dropdown is changed in offering modal, update the display
  $("#semesterModalTypeDropdown").on("click", ".dropdown-item", function () {
    $("#semesterModalTypeDropdown button").html(
      $(this).text() + ' <span class="caret"></span>'
    );

    // Set which semester is affected in hidden input box
    semesterId = $(this).attr("id").replace("semester", "");
    $("input#semesters").val(semesterId);
  });

  // Function for deleting selected course row
  $(document).on("click", ".deleteCourse", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    var courseId = rowId.replace("row", "");
    var request = $.ajax({
      url: "/courses/deleteCourse",
      type: "POST",
      data: { id: courseId },
      dataType: "json",
    }).done(function (data) {
      if (!data.isCourseDeleted) {
        // Not able to delete course
        //Show error message
        $("div#courseMessages")
          .append(`<div class="deletingCourseErrorMessage alert alert-danger alert-dismissible">
        Error: Cannot delete course that already has offerings corresponding to it
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`);
      }
      // Deletion successful
      else {
        // Show success message
        $("div#courseMessages")
          .append(`<div class="deletingCourseSuccessMessage alert alert-success alert-dismissible">
        Course successfully deleted!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`);
        // Update courses shown
        $("#courseTable tbody tr").remove();
        retrieveCourses(courseOptions);
        // Get rid of any filters done
        $("#filterModifyCourseOptions, #filterModifySemesterOptions").val("");
      }
    });
  });

  // Use AJAX to submit course form
  $("#courseForm").submit(function (e) {
    // Override the default
    e.preventDefault();
    // Get form info
    var form = $(this);
    var action = form.attr("action");
    // Don't show modal anymore
    $("#courseModal").css({ display: "none" });

    // Submit form information
    $.ajax({
      type: "POST",
      url: action,
      data: form.serialize(),
      success: function (data) {
        if (data.isCourseAdded) {
          // Show course added success message
          $("div#courseMessages")
            .append(`<div class="addingCourseSuccessMessage alert alert-success alert-dismissible">
           Course successfully added!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
         </div>`);
        } else if (data.isCourseEdited) {
          // Show course edited success message
          $("div#courseMessages")
            .append(`<div class="editingCourseSuccessMessage alert alert-success alert-dismissible">
           Course successfully edited!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
         </div>`);
        }
        // Get the course entries again
        $("#courseTable tbody tr").remove();
        retrieveCourses(courseOptions);
        // Get rid of any filtering
        $("#filterModifyCourseOptions, #filterModifySemesterOptions").val("");
      }
    });
  });

  // Function for editing selected course row
  $(document).on("click", ".editCourse", function () {
    // Show course Modal
    $("#courseModal").css("display", "block");
    // Populate selected course in modal to be edited
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    id = rowId.replace("row", "");
    populateEditCourseModal(id);
    // Add/edit modal for courses will now show edit info
    showEditCourseModal();
  });

  // Show course selected in edit modal fields
  populateEditCourseModal = (id) => {
    $("form#courseForm input#courseFormId").val(id);
    $("form#courseForm input#name").val($(`#name${id}`).html());
    $("form#courseForm input#deptCode").val($(`#deptCode${id}`).html());
    $("form#courseForm input#number").val($(`#number${id}`).html());
    $("form#courseForm input#credits").val($(`#credits${id}`).html());
    $("form#courseForm input#desc").val($(`#desc${id}`).html());
  };

  // Change title, button, and action so course modal is for edit
  showEditCourseModal = () => {
    $("h1#courseTitle").html("Edit Course");
    $("#courseButton").val("Update Course");
    $("#courseForm").attr("action", "/courses/editCourse");
  };

  // Function for adding course
  $(document).on("click", "#addCourseButton", function () {
    // Show course modal with no placeholders
    $("#courseModal").css("display", "block");
    populateAddCourseModal();
    // Show add course modal, not edit
    showAddCourseModal();
  });

  // Get rid of placeholder values for add course modal
  populateAddCourseModal = () => {
    $("form#courseForm input#name").val("");
    $("form#courseForm input#deptCode").val("");
    $("form#courseForm input#number").val("");
    $("form#courseForm input#credits").val("");
    $("form#courseForm input#desc").val("");
  };

  // Change title, button, and action so course modal is for add
  showAddCourseModal = () => {
    $("h1#courseTitle").html("Add Course");
    $("#courseButton").val("Add Course");
    $("#courseForm").attr("action", "/courses/addCourse");
  };

  // Cancelling course modal makes it invisible
  $(".courseCancel").click(function () {
    $("#courseModal").css("display", "none");
  });

});
