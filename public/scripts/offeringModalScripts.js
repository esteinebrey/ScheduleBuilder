// File containing functions for editing, adding, and deleting offerings

$(document).ready(function () {
    // Modal is originally invisible
    $("#offeringModal").css({ display: "none" });
  
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
  
    // Function for deleting offering row selected
    $(document).on("click", ".deleteOffering", function () {
      var rowId = $(this).parentsUntil("tbody").last().attr("id");
      var offeringId = rowId.replace("row", "");
      $.ajax({
        url: "/offerings/deleteOffering",
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
      // Populate Edit Offering modal with the currently selected semester option
      // Update display
      $("#semesterDropdown button").html(
        `${$('#courseMaintenanceMainDropdown button').html()}`
       );
       // Set hidden input value to match populated semester; set it to be ID of semester
       $("input#semesters").val($('#courseMaintenanceMainDropdown button').attr('id').replace('semester', ''));
    };
  
    // Change title, button, and action so offering modal is for edit
    showEditOfferingModal = () => {
      $("h1#offeringTitle").html("Edit Course Offering");
      $("#offeringButton").val("Update Offering");
      $("#offeringForm").attr("action", "/offerings/editOffering");
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
      // Populate Add Offering modal with the first semester option
      // Update display
      console.log($('#semesterOfferingDropdown li:first-child a'));
      $("#semesterDropdown button").html(
        `${$('#semesterOfferingDropdown li:first-child a').html()} <span class="caret"></span>`
       );
       // Set hidden input value to match populated semester; set it to be ID of semester
       $("input#semesters").val($('#semesterOfferingDropdown li:first-child a').attr('id').replace('semester', ''));
    };
  
    // Change title, button, and action so offering modal is for add
    showAddOfferingModal = () => {
      $("h1#offeringTitle").html("Add Course Offering");
      $("#offeringButton").val("Add Offering");
      $("#offeringForm").attr("action", "/offerings/addOffering");
    };
  
    // Cancelling offering modal makes it invisible
    $(".offeringCancel").click(function () {
      $("#offeringModal").css("display", "none");
    });
  });
  