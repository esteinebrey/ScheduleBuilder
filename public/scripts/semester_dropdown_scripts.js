// Get recent semesters that can be added to or deleted from student's schedule using AJAX
function retrieveRecentSemesters() {
    // Create XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Create semesters object and create dropdown from it
        var semesters = JSON.parse(xhr.responseText);
        processSemesterInfo(semesters);
      }
    };
    xhr.open("GET", "getRecentSemesters", true);
    xhr.send();
}
  
  function processSemesterInfo(semesters) {
    if (semesters.length > 0) {
      // Access the table
      var dropdown = $("#semesterDropdown");
      var formDropdown = $("#semesterOfferingDropdown");
      var i;
      var semester;
      for (i = 0; i < semesters.length; i++) {
        semester = semesters[i];
        // Add semesters found to dropdown
        addToSemesterDropdown(semester, dropdown);
        addToSemesterDropdown(semester, formDropdown);
      }
    }
  }
  
  // Used to get the semesters to show in dropdown
  function addToSemesterDropdown(semester, dropdown) {
      var semesterOutput = `<option value='${semester.semesterId}'>`;
      semesterOutput += `${semester.season} ${semester.year}`;
      semesterOutput += "</option>"
  
      // Add to dropdown
      dropdown.append(semesterOutput);
  }  