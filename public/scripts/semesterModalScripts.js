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
      $("form#addEditSemesterForm input#season").val(
        $(`#season${id}`).html()
      );
      $("form#addEditSemesterForm input#year").val($(`#year${id}`).html());
      if ($(`#isRecent${id}`).html() == "true") {
        $(
          "form#addEditSemesterForm select#recentType option[value='true']"
        ).attr("selected", true);
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