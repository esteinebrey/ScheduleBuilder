// File that contains functions for Build Schedule page to add to and delete from schedule

$(document).ready(function () {
  // Function from deleting course from schedule
  $(document).on("click", ".deleteOffering", function () {
    // Get the registration ID for the record that indicates the student is taking the course
    var rowId = $(this).parentsUntil("tbody").last().attr("class");
    var registrationId = rowId.replace("offeringRow", "");
    $.ajax({
      url: "/deleteFromSchedule",
      type: "POST",
      data: { id: registrationId },
      dataType: "json",
    });
    location.reload();
  });

  // Function for adding course to student schedule
  $(document).on("click", ".addOffering", function () {
    // Get the offering ID of the course to add to student's schedule
    var rowId = $(this).parentsUntil("tbody").last().attr("class");
    var offeringId = rowId.replace("offeringRow", "");
    $.ajax({
      url: "/addToSchedule",
      type: "POST",
      data: { id: offeringId },
      dataType: "json",
    });
    location.reload();
  });
});
