// File that contains functions for Build Schedule page to add to and delete from schedule

$(document).ready(function () {
  // General information for the page
  var offeringType = {
    isUserOffering: true,
    isSemesterOffering: false,
    isNotUserOffering: true,
  };
  var sections = {
    userOfferings: "registeredCourses",
    availableOfferings: "possibleCourses",
  };
  var editOptions = {
    semesterOffering: { delete: false, add: true, type: "coursesOffered" },
    userOffering: { delete: true, add: false, type: "studentSchedule" },
  };
  // Hide the content until a semester is chosen
  $("#buildScheduleContent").hide();

  // Function from deleting course from schedule
  $(document).on("click", ".deleteOffering", function () {
    // Get the registration ID for the record that indicates the student is taking the course
    var registrationClass = $(this)
      .parentsUntil("div#registeredCourses")
      .last()
      .attr("class");

    var registrationId = registrationClass.replace(
      "panel panel-default studentSchedule",
      ""
    );
    $.ajax({
      url: "/registrations/deleteFromSchedule",
      type: "POST",
      data: { id: registrationId },
      dataType: "json",
    });
    // Show success message and reload courses
    $(
      "div#successMessages"
    ).append(createSuccessMessage("deleteCourseSuccessMessage", "Course successfully deleted!"));
    showCourses(
      $("#buildScheduleSemesterDropdown").val(),
      offeringType,
      sections,
      editOptions
    );
  });

  // Function for adding course to student schedule
  $(document).on("click", ".addOffering", function () {
    // Get the offering ID of the course to add to student's schedule
    var offeringClass = $(this)
      .parentsUntil("div#possibleCourses")
      .last()
      .attr("class");
    var offeringId = offeringClass.replace(
      "panel panel-default coursesOffered",
      ""
    );
    $.ajax({
      url: "/registrations/addToSchedule",
      type: "POST",
      data: { id: offeringId },
      dataType: "json",
    });
    // Show success message and reload courses
    $(
      "div#successMessages"
    ).append(createSuccessMessage("addCourseSuccessMessage", "Course successfully added!"));
    showCourses(
      $("#buildScheduleSemesterDropdown").val(),
      offeringType,
      sections,
      editOptions
    );
  });
});
