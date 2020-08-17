// Scripts to filter and search

$(document).ready(function() {
    $("#filterCourses").on("keyup", function() {
        var searchedText = $(this).val().toLowerCase();
        $(".panel").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchedText) > -1);
        });
    })
});