// Scripts to filter and search on Build Schedule, View Courses, and Course Maintenance pages

$(document).ready(function() {
    $("#filterCourses, #filterCourseOptions").on("keyup", function() {
        var searchedText = $(this).val().toLowerCase();
        $(".panel").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchedText) > -1);
        });
    });

    $("#filterModifyCourseOptions").on("keyup", function() {
        var searchedText = $(this).val().toLowerCase();
        $("table#courseTable tbody tr, table#offeringTable tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchedText) > -1);
        });
    });

    $("#filterModifySemesterOptions").on("keyup", function() {
        var searchedText = $(this).val().toLowerCase();
        $("table#semesterTable tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchedText) > -1);
        });
    });

    $("#filterUsers").on("keyup", function() {
        var searchedText = $(this).val().toLowerCase();
        $("table#adminTable tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchedText) > -1);
        });
    });
});