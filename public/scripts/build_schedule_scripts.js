$(document).ready(function () {
  // function for deleting registration
  $(document).on("click", ".deleteOffering", function () {
    console.log("deleting");
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

  // function for adding course to student schedule
  $(document).on("click", ".addOffering", function () {
    console.log("adding");
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
