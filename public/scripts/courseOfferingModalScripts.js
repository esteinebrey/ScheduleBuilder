$(document).ready(function () {
  // modal is orginally invisible
  $("#courseModal").css("display", "none");
  $("#offeringModal").css("display", "none");

  // function for deleting offering row
  $(document).on("click", ".deleteOffering", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    console.log(rowId);
    var offeringId = rowId.replace("row", "");
    $.ajax({
      url: "/deleteOffering",
      type: "POST",
      data: { id: offeringId },
      dataType: "json",
    });
    location.reload();
  });

  // function for deleting course row
  $(document).on("click", ".deleteCourse", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    var courseId = rowId.replace("row", "");
    $.ajax({
      url: "/deleteCourse",
      type: "POST",
      data: { id: courseId },
      dataType: "json",
    });
    location.reload();
  });

  // function for editing course row
  $(document).on("click", ".editCourse", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    id = rowId.replace("row", "");
    $("#courseModal").css("display", "block");

    $("form#courseForm input#id").val(id);
    $("form#courseForm input#name").val($(`#name${id}`).html());
    $("form#courseForm input#deptCode").val($(`#deptCode${id}`).html());
    $("form#courseForm input#number").val($(`#number${id}`).html());
    $("form#courseForm input#credits").val($(`#credits${id}`).html());
    $("form#courseForm input#desc").val($(`#desc${id}`).html());

    $("h1#courseTitle").html("Edit Course");
    $("#courseButton").val("Update Course");
    $("#courseForm").attr("action", "/editCourse");
  });

  // function for editing offering row
  $(document).on("click", ".editOffering", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("class");
    id = rowId.replace("coursesOffered", "");
    $("#offeringModal").css("display", "block");

    $("form#offeringForm input#id").val(id);
    $("form#offeringForm input#prof").val($(`#prof${id}`).html());
    $("form#offeringForm input#days").val($(`#days${id}`).html());
    $("form#offeringForm input#time").val($(`#time${id}`).html());
    $("form#offeringForm input#building").val($(`#building${id}`).html());
    $("form#offeringForm input#room").val($(`#room${id}`).html());

    $("h1#offeringTitle").html("Edit Course Offering");
    $("#offeringButton").val("Update Offering");
    $("#offeringForm").attr("action", "/editOffering");
  });

  // function for adding semester
  $(document).on("click", "#addCourseButton", function () {
    $("#courseModal").css("display", "block");
    $("form#courseForm input#name").val("");
    $("form#courseForm input#deptCode").val("");
    $("form#courseForm input#number").val("");
    $("form#courseForm input#credits").val("");
    $("form#courseForm input#desc").val("");
    $("h1#courseTitle").html("Add Course");
    $("#courseButton").val("Add Course");
    $("#courseForm").attr("action", "/addCourse");
  });

  $(document).on("click", ".addOffering", function () {
    var rowId = $(this).parentsUntil("tbody").last().attr("id");
    id = rowId.replace("row", "");
    $("#offeringModal").css("display", "block");

    $("form#offeringForm input#id").val(id);
    $("form#offeringForm input#prof").val("");
    $("form#offeringForm input#days").val("");
    $("form#offeringForm input#time").val("");
    $("form#offeringForm input#building").val("");
    $("form#offeringForm input#room").val("");

    $("h1#offeringTitle").html("Add Course Offering");
    $("#offeringButton").val("Add Offering");
    $("#offeringForm").attr("action", "/addOffering");
  });

  // cancelling course modal makes it invisible
  $(".courseCancel").click(function () {
    $("#courseModal").css("display", "none");
  });

  // cancelling offering modal makes it invisible
  $(".offeringCancel").click(function () {
    $("#offeringModal").css("display", "none");
  });
});
