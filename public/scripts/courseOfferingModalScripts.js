// File containing functions for editing, adding, and deleting courses and offerings

$(document).ready(function () {
  // Modal is originally invisible
  $("#courseModal").css({ display: "none" });
  $("#offeringModal").css({ display: "none" });
  // Make error message invisible
  $("#deletingCourseErrorMessage").css({ display: "none" });

  // Set up basic information for Course Maintenance page
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

  // Function for deleting offering row selected
  $(document).on("click", ".deleteOffering", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    var offeringId = rowId.replace("row", "");
    $.ajax({
      url: "/deleteOffering",
      type: "POST",
      data: { id: offeringId },
      dataType: "json",
    }).done(function (data) {
      if (!data.isOfferingDeleted) {
        // Show error message; cannot delete offering if student already registered for it
        $("div#courseMessages")
          .append(`<div class="deletingOfferingErrorMessage alert alert-danger alert-dismissible">
        Error: Cannot delete course offering that student has already registered for
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`);
      } else {
        // Show success message
        $("div#courseMessages")
          .append(`<div class="deletingOfferingSuccessMessage alert alert-success alert-dismissible">
        Course Offering successfully deleted!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`);
        // Update courses shown
        showCorrectTable(
          $("div#courseMaintenanceMainDropdown button").attr("id")
        );
        onSelect(
          $("div#courseMaintenanceMainDropdown button").attr("id"),
          offeringType,
          tables,
          editOptions
        );
        // Get rid of any filters
        $("#filterModifyCourseOptions, #filterModifySemesterOptions").val("");
      }
    });
  });

  // Function for deleting selected course row
  $(document).on("click", ".deleteCourse", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    var courseId = rowId.replace("row", "");
    var request = $.ajax({
      url: "/deleteCourse",
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

  // Use AJAX to submit course offering form
  $("#offeringForm").submit(function (e) {
    // Override the default
    e.preventDefault();
    // Get form info
    var form = $(this);
    var action = form.attr("action");
    // Don't show modal anymore
    $("#offeringModal").css({ display: "none" });

    // Submit form information
    $.ajax({
      type: "POST",
      url: action,
      data: form.serialize(),
      success: function (data) {
        if (data.isOfferingAdded) {
          // Show course added success message
          $("div#courseMessages")
            .append(`<div class="addingOfferingSuccessMessage alert alert-success alert-dismissible">
           Course offering successfully added!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
         </div>`);
        } else if (data.isOfferingEdited) {
          // Show course edited success message
          $("div#courseMessages")
            .append(`<div class="editingOfferingSuccessMessage alert alert-success alert-dismissible">
           Course offering successfully edited!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
         </div>`);
        }
        // Get the updated entries
        showCorrectTable(
          $("div#courseMaintenanceMainDropdown button").attr("id")
        );
        onSelect(
          $("div#courseMaintenanceMainDropdown button").attr("id"),
          offeringType,
          tables,
          editOptions
        );
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
    $("#courseForm").attr("action", "/editCourse");
  };

  // Function for editing offering row
  $(document).on("click", ".editOffering", function () {
    // Show offering modal and populate it
    $("#offeringModal").css("display", "block");
    var rowId = $(this).parentsUntil("tbody").last().attr("class");
    id = rowId.replace("coursesOffered", "");
    populateEditOfferingModal(id);
    // Add/edit modal for offerings will now show edit info
    showEditOfferingModal();
  });

  // Selected offering info will be displayed in edit modal
  populateEditOfferingModal = (id) => {
    $("form#offeringForm input#offeringFormId").val(id);
    $("form#offeringForm input#prof").val($(`#prof${id}`).html());
    $("form#offeringForm input#days").val($(`#days${id}`).html());
    $("form#offeringForm input#time").val($(`#time${id}`).html());
    $("form#offeringForm input#building").val($(`#building${id}`).html());
    $("form#offeringForm input#room").val($(`#room${id}`).html());
    $("form#offeringForm input#capacity").val($(`#capacity${id}`).html());
  };

  // Change title, button, and action so offering modal is for edit
  showEditOfferingModal = () => {
    $("h1#offeringTitle").html("Edit Course Offering");
    $("#offeringButton").val("Update Offering");
    $("#offeringForm").attr("action", "/editOffering");
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
    $("#courseForm").attr("action", "/addCourse");
  };

  // Function for adding offering
  $(document).on("click", ".addOffering", function () {
    // Show offering Modal
    $("#offeringModal").css("display", "block");
    // Find course to create offering for and populate modal
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    id = rowId.replace("row", "");
    populateAddOfferingModal(id);
    // Show add offering modal, not edit
    showAddOfferingModal();
  });

  // Keep track of corresponding course ID for add offering modal and have no placeholder values
  populateAddOfferingModal = (id) => {
    $("form#offeringForm input#offeringFormId").val(id);
    $("form#offeringForm input#prof").val("");
    $("form#offeringForm input#days").val("");
    $("form#offeringForm input#time").val("");
    $("form#offeringForm input#building").val("");
    $("form#offeringForm input#room").val("");
    $("form#offeringForm input#capacity").val("");
  };

  // Change title, button, and action so offering modal is for add
  showAddOfferingModal = () => {
    $("h1#offeringTitle").html("Add Course Offering");
    $("#offeringButton").val("Add Offering");
    $("#offeringForm").attr("action", "/addOffering");
  };

  // Cancelling course modal makes it invisible
  $(".courseCancel").click(function () {
    $("#courseModal").css("display", "none");
  });

  // Cancelling offering modal makes it invisible
  $(".offeringCancel").click(function () {
    $("#offeringModal").css("display", "none");
  });
});
